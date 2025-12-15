/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 06:33:09 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS

/* ====================== IMPORTS ====================== */

import { router }							from "../index.js"
import { PongGame }							from "../Pong/pong.js"
import { TankGame } 						from "../tank/tank.js"
import { socket }							from "../socket/socket.js"
import { getMenu }							from "../utils/getMenu.js"
import { AppState, appStore, UserState }	from "../objects/store.js"
import { displayError, displayPopError }	from "../utils/display.js"
import { loadTwofa }						from "../router/loadPage.js"
import { TournamentController } 			from "../Pong/tournament.js"
import { sendRequest }						from "../utils/sendRequest.js"
import { verifyEmail }						from "../utils/verifyEmail.js"
import { GameOptions }						from "../Pong/objects/gameOptions.js"
import { initHistoryListeners } 			from "../history/getAndRenderHistory.js"
import { Player }							 from "../Pong/objects/tournamentObjects.js"


import { Game }	from "../Pong/gameClass.js"

/* ====================== FUNCTIONS ====================== */

function onClickPlay(): void {
	const	maxPointsInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
	if (!(maxPointsInput instanceof HTMLFormElement)) return;

	const	state: AppState = appStore.getState();
	const	currentGame: Game | null = state.game.currentGame;
	currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/pong");
}

async function  onClickLogout(): Promise<void> {
	const	response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

	if (!response.ok)
		return displayPopError(response)

	appStore.setState((state) => ({
		...state,
		user: {
			id: null,
			username: null,
			avatar: null,
			isAuth: false
		}
	}));

	const	menu: HTMLElement | null = document.getElementById("nav");
	if (menu)
		menu.innerHTML = getMenu(false);
			
	if (socket && socket.connected)
		socket.disconnect();

	router.navigate("/");
}
	
async function	onClickEdit(): Promise<void> {
	const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
	if (!response.ok)
		return displayPopError(response);

	const	userRes = await response.json();

	const	editElements = document.querySelectorAll(".edit-mode");
	const	viewElements = document.querySelectorAll(".view-mode");

	editElements.forEach(e => {
		if (e instanceof HTMLElement)
			e.hidden = false;
	});
	
	viewElements.forEach(e => {
		if (e instanceof HTMLElement)
			e.hidden = true;
	});

	const	username: HTMLElement | null = document.getElementById("edit-username");
	if (!(username instanceof HTMLInputElement)) return;
	username.value = userRes.username ?? "";

	const	mail: HTMLElement | null = document.getElementById("edit-email");
	if (!(mail instanceof HTMLInputElement)) return;
	mail.value = userRes.email ?? "";
}

export async function	onClickHistory(targetId: number | null, targetName: string | null): Promise<void> {
	console.log("History => " + targetId + " - " + targetName);
	// TODO: SECURE IF NOT AUTH

	router.navigate("/history");

	setTimeout(() => {
		initHistoryListeners(targetId, targetName);
	}, 50);
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
		return ;

	const	confirmSettingForm: HTMLElement | null = document.getElementById("confirm-setting-form");
	if (confirmSettingForm)
		confirmSettingForm.classList.add("darken");


	const	p: HTMLElement | null = document.getElementById("confirm-setting-msg-error");
	if (p)
		p.textContent = null;
	
	const	response: Response = await sendRequest(`/api/auth/delete/me`, 'POST', { password });

	if (confirmSettingForm)
		confirmSettingForm.classList.remove("darken");
	
	if (!response.ok)
		return displayError(response, "confirm-setting-msg-error");

	appStore.setState((state) => ({
		...state,
		user: {
			id: null,
			username: null,
			avatar: null,
			isAuth: false
		}
	}));
	
	const	menu: HTMLElement | null = document.getElementById("nav");
	if (menu)
		menu.innerHTML = getMenu(false);
			
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
	}
}

async function	onClickDeleteTwofa(): Promise<void> {
	if (!confirm("Are you sure you want to go back?"))
		return ;

	router.canLeave = true;

	const	response: Response = await sendRequest(`/api/auth/twofa/me`, 'delete', null);
	if (!response.ok)
		displayPopError(response)
	
	appStore.setState((state) => ({
		...state,
		user: {
			id: null,
			username: null,
			avatar: null,
			isAuth: false
		}
	}));

	const	menu: HTMLElement | null = document.getElementById("nav");
	if (menu)
		menu.innerHTML = getMenu(false);
			
	if (socket && socket.connected)
		socket.disconnect();

	if (router.Path === "/2fa")
		router.navigate("/sign-in");

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
	
	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

async function	onClickNewCode(): Promise<void> {
	const	btnSend: HTMLElement | null = document.getElementById("btnSend2faCode");
	const	spanCooldown: HTMLElement | null = document.getElementById("btnCooldown");
	const	locks: NodeListOf<Element> = document.querySelectorAll(".lock");

	if (btnSend instanceof HTMLButtonElement) btnSend.disabled = true;
	if (spanCooldown) spanCooldown.textContent = "(5s)";
	locks.forEach(e => {
		if (e instanceof HTMLElement)
			e.hidden = false;
	});

	const	res = await sendRequest('/api/jwt/twofa/recreat', 'PATCH', {});

	if (!res.ok) {
		if (btnSend instanceof HTMLButtonElement) btnSend.disabled = false;
		if (spanCooldown) spanCooldown.textContent = "";
		locks.forEach(e => {
			if (e instanceof HTMLElement)
				e.hidden = true;
		});

		displayPopError(res)
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
	).then(async (response) => {
			if (!response.ok) {
				if (btnSend instanceof HTMLButtonElement) btnSend.disabled = false;
				if (spanCooldown) spanCooldown.textContent = "";
				locks.forEach(e => {
					if (e instanceof HTMLElement)
						e.hidden = true;
				});
				displayPopError(response);
				return;
			}
		}
	);

	loadTwofa();
}

/* ====================== UI TOGGLE HELPERS ====================== */

function showDifficultyMenu() {
	const	mainBtns: HTMLElement | null = document.getElementById('main-menu-btns');
	const	diffBtns: HTMLElement | null = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.add('hidden');
		diffBtns.classList.remove('hidden');
	}
}

function hideDifficultyMenu() {
	const	mainBtns: HTMLElement | null = document.getElementById('main-menu-btns');
	const	diffBtns: HTMLElement | null = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.remove('hidden');
		diffBtns.classList.add('hidden');
	}
}

function switchGameMode(mode: 'default' | 'featured') {
	const	defDiv: HTMLElement | null = document.getElementById('default-mode-content');
	const	inputDiv: HTMLElement | null = document.getElementById('default-mode-content-input');
	const	featDiv: HTMLElement | null = document.getElementById('featured-mode-content');

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

function selectFeaturedDifficulty(level: number) {
	const	input: HTMLElement | null = document.getElementById('aiHardcore');
	if (!(input instanceof HTMLInputElement)) return;
	input.value = level.toString();

	for (let i = 1; i <= 4; i++) {
		document.getElementById(`btn-feat-${i}`)?.classList.remove('active');
	}

	document.getElementById(`btn-feat-${level}`)?.classList.add('active');
}

/* ====================== GAME & TOURNAMENT HANDLERS ====================== */

function onClickPlayAI(difficulty: 'easy' | 'medium' | 'hard') {
	const	maxPointsInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
	if (!(maxPointsInput instanceof HTMLInputElement)) return;
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

	currentGame!.setWinningScore(winningScore);	// SUR QUIL EXISTE (2 LIGNES AU DESSUS) ??

	router.navigate('/pong');
}

function onClickPlayPVP() {

	if (router.Path === '/pongmenu') {
		const	maxPointsInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
		if (!(maxPointsInput instanceof HTMLInputElement)) return;
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

		currentGame!.setWinningScore(winningScore);	// SUR QUIL EXISTE (2 LIGNES AU DESSUS) ??

		router.navigate('/pong');
	}
	else if (router.Path === '/tankmenu')
	{
		const	mapSelect: HTMLElement | null = document.getElementById("mapSelect");
		const	p1Select: HTMLElement | null = document.getElementById("p1TankSelect");
		const	p2Select: HTMLElement | null = document.getElementById("p2TankSelect");
		if (!(mapSelect instanceof HTMLSelectElement) || 
			!(p1Select instanceof HTMLSelectElement) || 
			!(p2Select instanceof HTMLSelectElement)) return;
		
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

function	onStartTournament() {
	const	inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.player-name-input');
	const	playerNames: Player[] = [];
	
	for (const input of inputs) {
    	const val = input.value.trim();
    	if (val !== '') {
    	    if (val.length >= 3 && val.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(val)) {
    	        playerNames.push({ name: val });
    	    } else {
    	        displayError("Player names must be valid.", "tournament-msg-error");
    	        return;
    	    }
    	}
	}
	if (playerNames.length < 4) {
		displayError("You need at least 4 players to start a tournament.", "tournament-msg-error");
		return;
	}
	if (new Set(playerNames).size !== playerNames.length) {
		displayError("Player names must be unique.", "tournament-msg-error");
		return;
	}
	const	scoreInput: HTMLElement | null = document.getElementById("choosenMaxPoints");
	if (!(scoreInput instanceof HTMLInputElement)) return;
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

async function onStartRankedTournament() { // TODO, vieux copier-coller mais cest plus pour avoir le mecanisme:
    
	console.log("RANKED TOURNAMENT")
	// const inputs = document.querySelectorAll('.ranked-player-input'); // Tes inputs
    // const players: Player[] = [];

    // // 1. Récupérer le user courant (déjà connecté)
    // const currentUser = Store.getUser(); // Ton store frontend
    // players.push({ name: currentUser.username, id: currentUser.id, isRegistered: true });

    // // 2. Vérifier les autres pseudos entrés
    // for (const input of inputs) {
    //     const username = input.value;
    //     if (!username) continue;

    //     // Appel API pour vérifier si le user existe et récupérer son ID
    //     // Tu dois sûrement avoir une route GET /users/:username ou GET /users?name=X
    //     const userCheck = await sendRequest('GET', `/api/users/find?username=${username}`);
        
    //     if (userCheck && userCheck.id) {
    //         players.push({ name: userCheck.username, id: userCheck.id, isRegistered: true });
    //     } else {
    //         alert(`L'utilisateur ${username} n'existe pas !`);
    //         return;
    //     }
    // }

    // if (players.length < 2) {
    //     alert("Il faut au moins 2 joueurs enregistrés.");
    //     return;
    // }

    // // 3. Lancer le tournoi
    // // On instancie la classe avec le flag isRanked à TRUE
    // window.tournamentController = new TournamentController(players, 5, true);
    
    // // Remplacer le HTML par le bracket (comme tu fais déjà)
    // document.getElementById('app').innerHTML = window.tournamentController.renderBracket();
}

function startTournamentMatch(matchId: string, p1: string, p2: string) {
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

function onClickStartFeatured(mode: 'ai' | 'pvp') {
	const	freqInput: HTMLElement | null = document.getElementById("powerupFreq");
	
	const	star1: boolean | undefined = (document.getElementById("chk-1star") as HTMLInputElement)?.checked;
	const	star2: boolean | undefined = (document.getElementById("chk-2star") as HTMLInputElement)?.checked;
	const	star3: boolean | undefined = (document.getElementById("chk-3star") as HTMLInputElement)?.checked;

	if (!(freqInput instanceof HTMLInputElement) || star1 === undefined || star2 === undefined || star3 === undefined) return;

	const	state: AppState = appStore.getState();
	const	user: UserState | null = state.user;

	if (router.Path === '/pongmenu')
	{
		const	aiInput: HTMLElement | null = document.getElementById("aiHardcore");
		const	pointsInput: HTMLElement | null = document.getElementById("featuredMaxPoints");
		if (!(aiInput instanceof HTMLInputElement) || !(pointsInput instanceof HTMLInputElement)) return;
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
			!(p2Select instanceof HTMLSelectElement) ) return;
		
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

function onClickHomeBtn() {
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
		if (!(target instanceof HTMLInputElement)) return;

		if (target.id === 'choosenMaxPoints') {
			const	display: HTMLElement | null = document.getElementById('points-display');
			if (display) {
				display.innerText = target.value;
			}
		}
		
		if (target.id === 'powerupFreq') {
			const	display: HTMLElement | null = document.getElementById('powerup-freq-display');
			if (display) {
				display.innerText = target.value + " sec";
			}
		}

		if (target.id === 'featuredMaxPoints') {
			const	display: HTMLElement | null = document.getElementById('featured-points-display');
			if (display) {
				display.innerText = target.value;
			}
		}
	});

	window.addEventListener('popstate', () => {
		if (!router.canLeave) {
			if (!confirm("This page is asking you to confirm that you want to leave — information you’ve entered may not be saved.")) {
				history.pushState({}, "", router.Path);
				return ;
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
