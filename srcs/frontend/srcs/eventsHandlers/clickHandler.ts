/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 17:05:08 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS

/* ====================== IMPORTS ====================== */

import { AppState, appStore, UserState }	from "../objects/store.js"
import { GameOptions }						from "../Pong/objects/gameOptions.js"
import { getMenu }							from "../utils/getMenu.js"
import { initHistoryListeners } 			from "../history/getAndRenderHistory.js"
import { PongGame }							from "../Pong/pong.js"
import { TankGame } 						from "../v3/tank.js"
import { TournamentController } 			from "../Pong/tournament.js"
import { router }							from "../index.js"
import { sendRequest }						from "../utils/sendRequest.js"
import { socket }							from "../socket/socket.js"
import { displayDate }						from "../utils/displayDate.js"
import { btnCooldown }						from "../utils/buttonCooldown.js"

import { Tank }	from "../v3/class_tank.js"
import { Game }	from "../Pong/gameClass.js"


/* ====================== FUNCTIONS ====================== */

function onClickPlay(): void {
	const	maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;

	const	state: AppState = appStore.getState();
	const	currentGame: Game | null = state.game.currentGame;
	currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/pong");
}

async function  onClickLogout(): Promise<void> {
	const   response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

	if (!response.ok)
		throw new Error('Logout failed');

	appStore.setState((state) => ({
		...state,
		user: {
			id: null,
			username: null,
			avatar: null,
			isAuth: false
		}
	}));

	const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(false);
			
	if (socket && socket.connected)
		socket.disconnect();

	router.navigate("/");
}
	
async function	onClickEdit(): Promise<void> {
	console.log("Edit");

	const	state: AppState = appStore.getState();
	const	user: UserState | null = state.user;

	const	response: Response = await sendRequest(`/api/user/${user.id}`, 'get', null);	//	MATHIS: GET /me
	if (!response.ok)
	{
		console.log(response.statusText);
		return ;
	}
	const	userRes = await response.json();

	const editElements = document.querySelectorAll(".edit-mode");
	const viewElements = document.querySelectorAll(".view-mode");

	editElements.forEach(e => {
		(e as HTMLElement).hidden = false;
	});
	
	viewElements.forEach(e => {
		(e as HTMLElement).hidden = true;
	});

	const username = document.getElementById("edit-username") as HTMLInputElement;
	username.value = userRes.username ?? "";
	const mail = document.getElementById("edit-email") as HTMLInputElement;
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
	console.log("Cancel");

	const viewElements = document.querySelectorAll(".view-mode");
	const editElements = document.querySelectorAll(".edit-mode");
	
	viewElements.forEach(e => {
		(e as HTMLElement).hidden = false;
	});
	
	editElements.forEach(e => {
		(e as HTMLElement).hidden = true;
	});
}

async function	onClickDeleteAccount(): Promise<void> {
	console.log("DeleteAccount");
	
	if (!confirm("Are you sure you want to delete your account?"))
		return ;

	const	response: Response = await sendRequest(`/api/auth/me`, 'delete', null);
	if (!response.ok) {
		console.log(response.statusText);
		return ;
	}
	await onClickLogout();
}

async function	onClickDeleteTwofa(): Promise<void> {
	console.log("DeleteTwofa");
	
	if (!confirm("Are you sure you want to go back?"))
		return ;
}

async function	onClickSkipeVerifyEmailDev(): Promise<void> {
	console.log("VerifyEmail");
	
	const response: Response = await sendRequest('/api/auth/dev/validate', 'post', {});

	if (!response.ok) {
		const	p = document.getElementById("verify-email-msg-error");
		if (!p)
			console.error("No HTMLElement named \`msg-error\`.");
		else {
			const	result = await response.json();
			p.textContent = result?.error || "An unexpected error has occurred";
		}
		return ;
	}

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));
	
	var menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

async function	onClickNewCode(): Promise<void> {
	const btnSend = document.getElementById("btnSend2faCode") as HTMLButtonElement;
	const spanCooldown = document.getElementById("btnCooldown");
	const locks = document.querySelectorAll(".lock");

	if (spanCooldown) spanCooldown.textContent = "(5s)";
	locks.forEach(e => (e as HTMLElement).hidden = false);
	if (btnSend) btnSend.disabled = true;

	const response = await sendRequest('/api/twofa/otp', 'GET', null);

	if (!response.ok) {
		console.error("Erreur API:", response.statusText);
		if (btnSend) btnSend.disabled = false;
		if (spanCooldown) spanCooldown.textContent = "";
		locks.forEach(e => (e as HTMLElement).hidden = true);
		return;
	}
	btnCooldown(); 
	displayDate(5);
}

async function onClickGetMessage(): Promise<void> {
	const   res: Response = await fetch('/api/jwt', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const   data: unknown = await res.json();
	console.log(data);
}

async function onClickValidateMessage(): Promise<void> {
	const   res: Response = await fetch('/api/jwt/validate', {
		method: "get",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
	});

	const   data: unknown = await res.json();
	console.log(data);
}

async function onClickBlockMessage(): Promise<void> {
	const   res: Response = await fetch('/api/user/friends/block', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ receiverId: 2 })
	});

	if (!res.ok) {
		const   errorText = await res.text();
		console.error(`Échec du blocage. Statut : ${res.status}. Message : ${errorText}`);
		return ;
	}

	let data: unknown;

	const contentLength = res.headers.get('Content-Length');
	
	if (res.status === 204 || contentLength === '0' || contentLength === null) {
		data = { message: `Action réussie. (Statut ${res.status})` }; 
	} else {
		try {
			 data = await res.json();
		} catch (e) {
			console.error("Erreur de parsing JSON malgré le statut de succès:", e);
			data = { error: "Réponse du serveur invalide (Non-JSON)." };
		}
	}
	
	console.log(data);
}

async function onClickRefreshMessage(): Promise<void> {
	const   res: Response = await fetch('/api/jwt/refresh', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const   data: unknown = await res.json();
	console.log(data);
}


/* ====================== UI TOGGLE HELPERS ====================== */

function showDifficultyMenu() {
	const mainBtns = document.getElementById('main-menu-btns');
	const diffBtns = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.add('hidden');
		diffBtns.classList.remove('hidden');
	}
}

function hideDifficultyMenu() {
	const mainBtns = document.getElementById('main-menu-btns');
	const diffBtns = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.remove('hidden');
		diffBtns.classList.add('hidden');
	}
}

function switchGameMode(mode: 'default' | 'featured') {
	const defDiv = document.getElementById('default-mode-content');
	const featDiv = document.getElementById('featured-mode-content');

	if (mode === 'default') {
		defDiv?.classList.remove('hidden');
		featDiv?.classList.add('hidden');
	} else {
		defDiv?.classList.add('hidden');
		featDiv?.classList.remove('hidden');
	}
}

function selectFeaturedDifficulty(level: number) {
	const input = document.getElementById('aiHardcore') as HTMLInputElement;
	if (input) {
		input.value = level.toString();
	}

	for (let i = 1; i <= 4; i++) {
		document.getElementById(`btn-feat-${i}`)?.classList.remove('active');
	}

	document.getElementById(`btn-feat-${level}`)?.classList.add('active');
}

/* ====================== GAME & TOURNAMENT HANDLERS ====================== */

function onClickPlayAI(difficulty: 'easy' | 'medium' | 'hard') {
	const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	const winningScore = parseInt(maxPointsInput.value, 10);
	
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
		const	maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;
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
		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new TankGame('tank-canvas', 'desertfox')
			}
		}));

		router.navigate('/tank');
	}
}

function	onStartTournament() {
	const inputs = document.querySelectorAll('.player-name-input') as NodeListOf<HTMLInputElement>;
	const playerNames: string[] = [];
	
	inputs.forEach(input => {
		if (input.value.trim() !== '') {
			playerNames.push(input.value.trim());
		}
	});

	if (playerNames.length < 4) {
		alert("You need at least 4 players to start a tournament.");
		return;
	}

	const scoreInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	const winningScore = parseInt(scoreInput.value, 10);

	appStore.setState((state) => ({
		...state,
		game: {
			...state.game,
			currentTournament: new TournamentController(playerNames, winningScore)
		}
	}));

	router.navigate("/tournament-bracket");
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
	const freqInput = document.getElementById("powerupFreq") as HTMLInputElement;
	const aiInput = document.getElementById("aiHardcore") as HTMLInputElement;
	const pointsInput = document.getElementById("featuredMaxPoints") as HTMLInputElement;
	const star1 = (document.getElementById("chk-1star") as HTMLInputElement).checked;
	const star2 = (document.getElementById("chk-2star") as HTMLInputElement).checked;
	const star3 = (document.getElementById("chk-3star") as HTMLInputElement).checked;

	const	state: AppState = appStore.getState();
	const	user: UserState | null = state.user;
	const	currentGame: Game | null = state.game.currentGame;
	const	currentTournament: TournamentController | null = state.game.currentTournament;

	if (router.Path === '/pongmenu')
	{
		const	winningScore = parseInt(pointsInput.value, 10);

		const	aiVal = parseInt(aiInput.value);
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
		console.log(`Starting Featured (${mode}): Freq=${freqInput.value}, Stars=[${star1},${star2},${star3}]`);
		const freq = parseInt(freqInput.value,10);

		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new TankGame('tank-canvas', 'desertfox', freq, star1, star2, star3)
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
	(window as any).onClickDeleteTwofa = () => onClickDeleteTwofa();
	(window as any).onClickNewCode = () => onClickNewCode();
	(window as any).onClickSkipeVerifyEmailDev = () => onClickSkipeVerifyEmailDev();

	(window as any).onClickGetMessage = onClickGetMessage;
	(window as any).onClickValidateMessage = onClickValidateMessage;
	(window as any).onClickRefreshMessage = onClickRefreshMessage;
	(window as any).onClickBlockMessage = onClickBlockMessage;
	
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
	
	(window as any).startTournamentMatch = (matchId: string, p1: string, p2: string) => 
		startTournamentMatch(matchId, p1, p2);


	document.addEventListener('click', (event) => {
		const target = event.target as HTMLAnchorElement;
		if (target.tagName === 'A' && target.hasAttribute('href')) {
			event.preventDefault();
			console.log(target.getAttribute('href')!);
			router.navigate(target.getAttribute('href')!);
		}
	});

	document.addEventListener('input', (event) => {
		const target = event.target as HTMLInputElement;
		if (!target) return;

		if (target.id === 'choosenMaxPoints') {
			const display = document.getElementById('points-display');
			if (display) {
				display.innerText = target.value;
			}
		}
		
		if (target.id === 'powerupFreq') {
			const display = document.getElementById('powerup-freq-display');
			if (display) {
				display.innerText = target.value + " sec";
			}
		}

		if (target.id === 'featuredMaxPoints') {
			const display = document.getElementById('featured-points-display');
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
  	const keysToBlock = [
  	  "ArrowUp", 
  	  "ArrowDown",
  	];
  	if (keysToBlock.includes(event.code)) {
  	  event.preventDefault();
  	}
});
}
