/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 12:21:20 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS

/* ====================== IMPORTS ====================== */

import { router }							from "../index.js"
import { PongGame }							from "../Pong/pong.js"
import { TankGame } 						from "../tank/tank.js"
import { socket }							from "../socket/socket.js"
import { displayError, displayPop }			from "../utils/display.js"
import { getMenu }							from "../utils/getMenu.js"
import { AppState, appStore, UserState }	from "../objects/store.js"
import { loadTwofa, loadUserStats }			from "../router/loadPage.js"
import { TournamentController } 			from "../Pong/tournament.js"
import { sendRequest }						from "../utils/sendRequest.js"
import { verifyEmail }						from "../utils/verifyEmail.js"
import { heartbeat }						from "../utils/heartbeat.js"
import { GameOptions }						from "../Pong/objects/gameOptions.js"
import { initHistoryListeners } 			from "../history/getAndRenderHistory.js"

import type { Game }	from "../Pong/gameClass.js"
import type { Player }	from "../Pong/objects/tournamentObjects.js"

/* ====================== FUNCTIONS ====================== */

function onClickPlay(): void {
	const	maxPointsInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
	if (!(maxPointsInput instanceof HTMLFormElement)){
		displayPop("Missing game menu HTMLElement!", "error");
		return;
	}

	const	state: AppState = appStore.getState();
	const	currentGame: Game | null = state.game.currentGame;
	currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/pong");
}

async function  onClickLogout(): Promise<void> {
	const	response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

	if (!response.ok)
		return displayPop(response, "error");

	appStore.setState((state) => ({
		...state,
		user: {
			id: null,
			username: null,
			avatar: null,
			pendingAvatar: null,
			isAuth: false
		}
	}));

	getMenu(false);

	if (socket && socket.connected)
		socket.disconnect();

	router.navigate("/");
}
	
async function	onClickEdit(): Promise<void> {
	const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
	if (!response.ok)
		return displayPop(response, "error");

	const	userRes: any = await response.json();

	const	editElements: NodeListOf<Element> = document.querySelectorAll(".edit-mode");
	const	viewElements: NodeListOf<Element> = document.querySelectorAll(".view-mode");

	editElements.forEach(e => {
		if (e instanceof HTMLElement)
			e.hidden = false;
	});
	
	viewElements.forEach(e => {
		if (e instanceof HTMLElement)
			e.hidden = true;
	});

	const	username: HTMLElement | null = document.getElementById("edit-username");
	if (!(username instanceof HTMLInputElement))
		return displayPop("Missing profile HTMLElement!", "error");
	username.value = userRes.username ?? "";

	const	mail: HTMLElement | null = document.getElementById("edit-email");
	if (!(mail instanceof HTMLInputElement))
		return displayPop("Missing profile HTMLElement!", "error");
	mail.value = userRes.email ?? "";
}

export async function	onClickHistory(targetId: number | null, targetName: string | null): Promise<void> {
	if (appStore.getState().user.isAuth){
		router.navigate("/history");
		
		setTimeout(() => {
			initHistoryListeners(targetId, targetName);
			if (targetId)
				loadUserStats(targetId, targetName);
		}, 50);
	}
	else
		router.navigate("/");
}

function	onClickCancel(): void {
	router.canLeave = true;

	const	confirmSetting: HTMLElement | null = document.getElementById("confirm-setting");
	if (confirmSetting)
		return router.navigate("/user");
	router.navigate("/")
}

async function onClickDeleteAccount(): Promise<void>{
	const	password: string | undefined = (document.getElementById("confirm-setting-password") as HTMLInputElement)?.value;
		
	if (!password) return displayError("password required!", "confirm-setting-msg-error");

	if (!confirm("Are you sure you want to delete your account?"))
		return;

	document.getElementById("confirm-setting-form")?.classList.add("darken");

	const	p: HTMLElement | null = document.getElementById("confirm-setting-msg-error");
	if (p) p.textContent = null;
	
	const	response: Response = await sendRequest(`/api/auth/delete/me`, 'POST', { password });

	document.getElementById("confirm-setting-form")?.classList.remove("darken");
	
	if (!response.ok)
		return displayError(response, "confirm-setting-msg-error");

	appStore.setState((state) => ({
		...state,
		user: {
			id: null,
			username: null,
			avatar: null,
			pendingAvatar: null,
			isAuth: false
		}
	}));
	
	getMenu(false);
			
	if (socket && socket.connected)
		socket.disconnect();

	router.canLeave = true;
	router.navigate("/");

}

async function	onClickDeleteAccountStep(): Promise<void> {
	verifyEmail("user-profile", "confirm-setting", null);
	
	document.getElementById("verify-email-submit")?.remove();
	
	const	divButtonProfile: HTMLElement | null = document.getElementById("div-button-profile");
	if (divButtonProfile) {
		const	buttonDeleteAccount = document.createElement("button");
		
		buttonDeleteAccount.type = "button";
		buttonDeleteAccount.id = "button-delete-account";
		buttonDeleteAccount.className = "verify-button-form";
		buttonDeleteAccount.textContent = "Confirm";
		
		buttonDeleteAccount.addEventListener("click", onClickDeleteAccount);
		divButtonProfile.appendChild(buttonDeleteAccount);
	} else 
		displayPop("Missing profile HTMLElement!", "error");
}

async function	onClickDeleteTwofa(): Promise<void> {
	if (!confirm("Are you sure you want to go back?"))
		return;

	router.canLeave = true;

	const	response: Response = await sendRequest(`/api/auth/twofa/me`, 'delete', null);
	if (!response.ok)
		displayPop(response, "error");
	
	appStore.setState((state) => ({
		...state,
		user: {
			id: null,
			username: null,
			avatar: null,
			pendingAvatar: null,
			isAuth: false
		}
	}));

	getMenu(false);
			
	if (socket && socket.connected)
		socket.disconnect();

	if (router.Path === "/2fa") {
		router.navigate("/sign-in");
		return;
	}

	router.navigate(router.Path);
}

async function	onClickSkipeVerifyEmailDev(): Promise<void> { // delete this
	const	response: Response = await sendRequest('/api/auth/dev/validate', 'post', {});

	if (!response.ok)
		return displayError(response, "verify-email-msg-error");

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	heartbeat();
	
	getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

async function	onClickNewCode(): Promise<void> {
	const	btnSend: HTMLElement | null = document.getElementById("btnSend2faCode");
	const	spanCooldown: HTMLElement | null = document.getElementById("btnCooldown");
	const	locks: NodeListOf<Element> = document.querySelectorAll(".lock");

	if (btnSend instanceof HTMLButtonElement) btnSend.disabled = true;
	else displayPop("Missing HTMLElement!", "error");
	if (spanCooldown) spanCooldown.textContent = "(5s)";
	else displayPop("Missing HTMLElement!", "error");
	locks.forEach(e => {
		if (e instanceof HTMLElement)
			e.hidden = false;
	});

	const	res: Response = await sendRequest('/api/jwt/twofa/recreat', 'PATCH', {});

	if (!res.ok)
	{
		if (btnSend instanceof HTMLButtonElement) btnSend.disabled = false;
		if (spanCooldown) spanCooldown.textContent = "";
		locks.forEach(e => {
			if (e instanceof HTMLElement)
				e.hidden = true;
		});

		displayPop(res, "error");
		return;
	}

	fetch('/api/twofa/otp', {
			method: 'POST',
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ })
		}
	).then((response: Response) => {
			if (!response.ok)
			{
				if (btnSend instanceof HTMLButtonElement) btnSend.disabled = false;
				if (spanCooldown) spanCooldown.textContent = "";
				locks.forEach(e => {
					if (e instanceof HTMLElement)
						e.hidden = true;
				});
				displayPop(response, "error");
				return;
			}
			loadTwofa();
		}
	).catch((e: unknown) => {
		displayPop("" + e, "error");
	});
}

/* ====================== UI TOGGLE HELPERS ====================== */

function showDifficultyMenu(): void {
	const	mainBtns: HTMLElement | null = document.getElementById('main-menu-btns');
	const	diffBtns: HTMLElement | null = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.add('hidden');
		diffBtns.classList.remove('hidden');
	} else
		displayPop("Missing menu game HTMLElement!", "error");
}

function hideDifficultyMenu(): void {
	const	mainBtns: HTMLElement | null = document.getElementById('main-menu-btns');
	const	diffBtns: HTMLElement | null = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.remove('hidden');
		diffBtns.classList.add('hidden');
	} else
		displayPop("Missing menu game HTMLElement!", "error");
}

function switchGameMode(mode: 'default' | 'featured'): void {
	const	defDiv: HTMLElement | null = document.getElementById('default-mode-content');
	const	inputDiv: HTMLElement | null = document.getElementById('default-mode-content-input');
	const	featDiv: HTMLElement | null = document.getElementById('featured-mode-content');

	if (!defDiv && !inputDiv && !featDiv)
		displayPop("Missing menu game HTMLElement!", "error");
	
	if (mode === 'default') {
		defDiv?.classList.remove('hidden');
		inputDiv?.classList.remove('hidden');
		featDiv?.classList.add('hidden');
	} else {
		defDiv?.classList.add('hidden');
		inputDiv?.classList.add('hidden');
		featDiv?.classList.remove('hidden');
	}
}

function selectFeaturedDifficulty(level: number): void {
	const	input: HTMLElement | null = document.getElementById('aiHardcore');
	if (!(input instanceof HTMLInputElement)) {
		displayPop("Missing menu game HTMLElement!", "error");
		return;
	}
	input.value = level.toString();

	for (let i = 1; i <= 4; i++) {
		document.getElementById(`btn-feat-${i}`)?.classList.remove('active');
	}

	document.getElementById(`btn-feat-${level}`)?.classList.add('active');
}

/* ====================== GAME & TOURNAMENT HANDLERS ====================== */

function onClickPlayAI(difficulty: 'easy' | 'medium' | 'hard'): void {
	const	maxPointsInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
	if (!(maxPointsInput instanceof HTMLInputElement)) {
		displayPop("Missing menu game HTMLElement!", "error");
		return;
	}
	const	winningScore: number = parseInt(maxPointsInput.value, 10);
	
	const	state: AppState = appStore.getState();
	const	user: UserState | null = state.user;
	const	currentGame: Game | null = state.game.currentGame;

	const	options: GameOptions = {
		width: 800,
		height: 600,
		isTournament: false,
		p1name: user.username || "Player 1",
		p2name: difficulty,
		mode: 'ai',
		difficulty: difficulty || 'medium',
		winningScore: parseInt(maxPointsInput.value, 10) || 5,
		powerUpFreq: 0,
		activePowerUps: {
			star1: false,
			star2: false,
			star3: false
		}
	};

	appStore.setState((state) => ({
		...state,
		game: {
			...state.game,
			currentGame: new PongGame('pong-canvas', 'score1', 'score2', 'winning-points'),
			pendingOptions: options
		}
	}));
	if (currentGame){
		currentGame.setWinningScore(winningScore);
		router.navigate('/pong');
	}
	else {
		displayPop("Missing pong Element!", "error");
		router.navigate('/');
	}

}

function onClickPlayPVP(): void {

	if (router.Path === '/pongmenu') {
		const	maxPointsInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
		if (!(maxPointsInput instanceof HTMLInputElement)){
			displayPop("Missing pong HTMLElement!", "error");
			return;
		}
		const	winningScore: number = parseInt(maxPointsInput.value, 10);

		const	state: AppState = appStore.getState();
		const	user: UserState | null = state.user;
		const	currentGame: Game | null = state.game.currentGame;

		const	options: GameOptions = {
			width: 800,
			height: 600,
			isTournament: false,
			p1name: user.username || "Player 1",
			p2name: "Player 2",
			mode: 'pvp',
			difficulty: "medium",
			winningScore: parseInt(maxPointsInput.value, 10) || 5,
			powerUpFreq: 0,
			activePowerUps: {
				star1: false,
				star2: false,
				star3: false
			}
		};

		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new PongGame('pong-canvas', 'score1', 'score2', 'winning-points'),
				pendingOptions: options
			}
		}));

		if (currentGame){
			currentGame.setWinningScore(winningScore);
			router.navigate('/pong');
		}
		else {
			displayPop("Missing pong Element!", "error");
			router.navigate('/');
		}
	}
	else if (router.Path === '/tankmenu')
	{
		const	mapSelect: HTMLElement | null = document.getElementById("mapSelect");
		const	p1Select: HTMLElement | null = document.getElementById("p1TankSelect");
		const	p2Select: HTMLElement | null = document.getElementById("p2TankSelect");
		if (!(mapSelect instanceof HTMLSelectElement) || 
			!(p1Select instanceof HTMLSelectElement) || 
			!(p2Select instanceof HTMLSelectElement))
		{
			displayPop("Missing tank HTMLElement!", "error");
			return;
		}
		
		const	selectedMap = mapSelect.value;
		const	p1Tank = p1Select.value;
		const	p2Tank = p2Select.value;
		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new TankGame('tank-canvas', selectedMap, 0, false, false, false, p1Tank, p2Tank)
			}
		}));

		router.navigate('/tank');
	}
}

function	onStartTournament(): void {
	const	inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.player-name-input');
	const	playerNames: Player[] = [];
	
	for (const input of inputs) {
		const val = input.value.trim();
		if (val !== '') {
			if (val.length >= 3 && val.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(val)) {
				playerNames.push({ name: val });
			} else {
				displayError("Player names must be 3-20 characters long and assume only letters, numbers, '-' or '_'.", "msg-error");
				return;
			}
		}
	}
	if (playerNames.length < 4) {
		displayError("You need at least 4 players to start a tournament.", "msg-error");
		return;
	}
	if (playerNames.length > 16) {
		displayError("You need a maximum of 16 players to start a tournament.", "msg-error");
		return;
	}
	const namesLower = playerNames.map(p => p.name.toLowerCase());
	if (new Set(namesLower).size !== playerNames.length) {
		displayError("Player names must be unique.", "msg-error");
		return;
	}
	const	scoreInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
	if (!(scoreInput instanceof HTMLInputElement)) {
		displayPop("Missing menu game HTMLElement!", "error");
		return;
	}
	const	winningScore: number = parseInt(scoreInput.value, 10);

	appStore.setState((state) => ({
		...state,
		game: {
			...state.game,
			currentTournament: new TournamentController(playerNames, winningScore)
		}
	}));

	router.navigate("/tournament-bracket");
}

async function onStartRankedTournament(): Promise<void> {
	const	state: AppState = appStore.getState();
	const	user: UserState | null = state.user;
	const	inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.ranked-input');
	const	playerNames: Player[] = [];
	
	if (user.username === null || user.id === null || !user.isAuth) {
		return;
	}
	
	let first: boolean = true;
	for (const input of inputs) {
		if (first) {
			playerNames.push({ name: user.username, id: user.id, isRegistered: user.isAuth });
			first = false; continue;
		}
		const val = input.value.trim();
		if (val !== '' && (val.length >= 3 && val.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(val))) {
			const	userCheckResponse: Response = await sendRequest(`/api/user/lookup/${val}`, "get", null);
			if (!userCheckResponse.ok) {
				displayError("User(s) not found.", "msg-error");
				return;
			}
			const userCheck = await userCheckResponse.json();
			playerNames.push({ name: val, id: userCheck.id, isRegistered: userCheck.isRegistered });
		} else {
			displayError("Player names must be 3-20 characters long and assume only letters, numbers, '-' or '_'.", "msg-error");
			return;
		}
	}
	if (playerNames.length != 4) {
		displayError("You need 4 players to start a ranked tournament.", "msg-error");
		return;
	}
	const namesLower = playerNames.map(p => p.name.toLowerCase());
	if (new Set(namesLower).size !== playerNames.length) {
		displayError("Player names must be unique.", "msg-error");
		return;
	}

	const	scoreInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
	if (!(scoreInput instanceof HTMLInputElement)) {
		displayPop("Missing menu game HTMLElement!", "error");
		return;
	}
	const	winningScore: number = parseInt(scoreInput.value, 10);

	appStore.setState((state) => ({
		...state,
		game: {
			...state.game,
			currentTournament: new TournamentController(playerNames, winningScore, true)
		}
	}));

	router.navigate("/tournament-bracket");
}

function startTournamentMatch(matchId: string, p1: string, p2: string): void {
	const	state: AppState = appStore.getState();
	const	currentTournament: TournamentController | null = state.game.currentTournament;

	if (currentTournament) {
		const	options: GameOptions = {
			width: 800,
			height: 600,
			isTournament: true,
			p1name: p1,
			p2name: p2,
			mode: "pvp",
			difficulty: "medium",
			winningScore: currentTournament.winningScore,
			powerUpFreq: 0,
			activePowerUps: { star1: false, star2: false, star3: false }
		};

		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new PongGame('pong-canvas', 'score1', 'score2', 'winning-points'),
				pendingOptions: options
			}
		}));

		currentTournament.startMatch(matchId, p1, p2);

		router.navigate('/pong');
	}
}

function onClickStartFeatured(mode: 'ai' | 'pvp'): void {
	const	freqInput: HTMLElement | null = document.getElementById("powerupFreq");
	
	const	star1: boolean | undefined = (document.getElementById("chk-1star") as HTMLInputElement)?.checked;
	const	star2: boolean | undefined = (document.getElementById("chk-2star") as HTMLInputElement)?.checked;
	const	star3: boolean | undefined = (document.getElementById("chk-3star") as HTMLInputElement)?.checked;

	if (!(freqInput instanceof HTMLInputElement) || star1 === undefined || star2 === undefined || star3 === undefined) {
		displayPop("Missing input HTMLElement!", "error");
		return;
	}

	const	state: AppState = appStore.getState();
	const	user: UserState | null = state.user;

	if (router.Path === '/pongmenu')
	{
		const	aiInput: HTMLElement | null = document.getElementById("aiHardcore");
		const	pointsInput: HTMLElement | null = document.getElementById("featuredMaxPoints");
		if (!(aiInput instanceof HTMLInputElement) || !(pointsInput instanceof HTMLInputElement)) {
			displayPop("Missing pong HTMLElement!", "error");
			return;
		}
		const	winningScore = parseInt(pointsInput.value, 10);

		const	aiVal: number = parseInt(aiInput.value);
		let		difficulty: "easy" | "medium" | "hard" | "boris" = "medium";
		if (aiVal === 1)
			difficulty = "easy";
		if (aiVal === 3)
			difficulty = "hard";
		if (aiVal === 4)
			difficulty = "boris";

		const	powerUpFrequency: number = parseInt(freqInput.value, 10) * 1000;

		const	options: GameOptions = {
			width: 800,
			height: 600,
			isTournament: false,
			p1name: user.username || "Player 1",
			p2name: mode === "ai" ? "AI (" + difficulty + ")" : "Player 2",
			mode: mode,
			difficulty: difficulty || "medium",
			winningScore: winningScore || 5,
			powerUpFreq: powerUpFrequency,
			activePowerUps: {
				star1: star1,
				star2: star2,
				star3: star3
			}
		};

		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new PongGame('pong-canvas', 'score1', 'score2', 'winning-points'),
				pendingOptions: options
			}
		}));

		router.navigate("/pong");

	}
	else if (router.Path === '/tankmenu')
	{
		const	mapSelect: HTMLElement | null = document.getElementById("mapSelect");
		const	p1Select: HTMLElement | null = document.getElementById("p1TankSelect");
		const	p2Select: HTMLElement | null = document.getElementById("p2TankSelect");

		if (!(mapSelect instanceof HTMLSelectElement) || 
			!(p1Select instanceof HTMLSelectElement) || 
			!(p2Select instanceof HTMLSelectElement) ) 
		{
			displayPop("Missing tank HTMLElement!", "error");
			return;
		}
		
		const	selectedMap: string = mapSelect.value;
		const	p1Tank: string = p1Select.value;
		const	p2Tank: string = p2Select.value;
		const	freq: number = parseInt(freqInput.value,10);

		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new TankGame('tank-canvas', selectedMap, freq, star1, star2, star3, p1Tank, p2Tank)
			}
		}));

		router.navigate("/tank");
	}
}

function onClickHomeBtn(): void {
	router.navigate('/games');
}

/* ====================== SETUP ====================== */

export async function   setupClickHandlers(): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay();
	(window as any).onClickLogout = () => onClickLogout();

	(window as any).onClickEdit = () => onClickEdit();
	(window as any).onClickHistory = (targetId: number | null = null, targetName: string | null = null) => onClickHistory(targetId, targetName);
	(window as any).onClickCancel = () => onClickCancel();
	(window as any).onClickDeleteAccount = () => onClickDeleteAccount();
	(window as any).onClickDeleteAccountStep = () => onClickDeleteAccountStep();
	(window as any).onClickDeleteTwofa = () => onClickDeleteTwofa();
	(window as any).onClickNewCode = () => onClickNewCode();
	(window as any).onClickSkipeVerifyEmailDev = () => onClickSkipeVerifyEmailDev(); // /!\ detete this
	
	(window as any).showDifficultyMenu = showDifficultyMenu;
	(window as any).hideDifficultyMenu = hideDifficultyMenu;

	(window as any).onClickHomeBtn = () => onClickHomeBtn();

	(window as any).switchGameMode = switchGameMode;
	(window as any).onClickStartFeatured = (mode: 'ai' | 'pvp') => onClickStartFeatured(mode);
	(window as any).selectFeaturedDifficulty = selectFeaturedDifficulty;

	(window as any).onClickPlayAI = (difficulty: 'easy' | 'medium' | 'hard') => 
		onClickPlayAI(difficulty);

	(window as any).onClickPlayPVP = () => onClickPlayPVP();
	(window as any).onStartTournament = () => onStartTournament();
	(window as any).onStartRankedTournament = () => onStartRankedTournament();
	
	(window as any).startTournamentMatch = (matchId: string, p1: string, p2: string) => 
		startTournamentMatch(matchId, p1, p2);


	document.addEventListener('click', (event) => {
		const	target: EventTarget | null = event.target;
		if (target instanceof HTMLAnchorElement && target.tagName === 'A' && target.hasAttribute('href')) {
			event.preventDefault();
			router.navigate(target.getAttribute('href')!);
		}
	});

	document.addEventListener('input', (event) => {
		const	target: EventTarget | null = event.target;
		if (!(target instanceof HTMLSelectElement) && !(target instanceof HTMLInputElement)) {
			displayPop("Missing HTMLElement!", "error");
			return;
		}

		if (target.id === 'choosenMaxPoints') {
			const	display: HTMLElement | null = document.getElementById('points-display');
			if (display) {
				display.innerText = target.value;
			} else
				displayPop("Missing display HTMLElement!", "error");
		}
		
		if (target.id === 'powerupFreq') {
			const	display: HTMLElement | null = document.getElementById('powerup-freq-display');
			if (display) {
				display.innerText = target.value + " sec";
			} else
				displayPop("Missing display HTMLElement!", "error");
		}

		if (target.id === 'featuredMaxPoints') {
			const	display: HTMLElement | null = document.getElementById('featured-points-display');
			if (display) {
				display.innerText = target.value;
			} else
				displayPop("Missing display HTMLElement!", "error");
		}
	});

	window.addEventListener('popstate', () => {
		if (!router.canLeave) {
			if (!confirm("This page is asking you to confirm that you want to leave — information you’ve entered may not be saved.")) {
				history.pushState({}, "", router.Path);
				return;
			}
			router.canLeave = true;
		}
		router.render();
	});

	window.addEventListener('keydown', (event: KeyboardEvent) => {
	const	keysToBlock: string[] = [
		"ArrowUp", 
		"ArrowDown",
	];
	if (keysToBlock.includes(event.code)) {
		event.preventDefault();
	}
});
}
