/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:55:22 by kiparis          ###   ########.fr       */
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
import { GameOptions }						from "../Pong/objects/gameOptions.js"
import { initHistoryListeners } 			from "../history/getAndRenderHistory.js"
import { Player }							 from "../Pong/objects/tournamentObjects.js"

import { Game }	from "../Pong/gameClass.js"

/* ====================== FUNCTIONS ====================== */

function onClickPlay(): void {
	const	maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	if (!maxPointsInput) return;

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

	const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
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
		(e as HTMLElement).hidden = false;
	});
	
	viewElements.forEach(e => {
		(e as HTMLElement).hidden = true;
	});

	const	username = document.getElementById("edit-username") as HTMLInputElement;
	if (!username) return;
	username.value = userRes.username ?? "";
	const	mail = document.getElementById("edit-email") as HTMLInputElement;
	if (!mail) return;
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

	const	confirmSetting = document.getElementById("confirm-setting");
	if (confirmSetting)
		return router.navigate("/user");
	router.navigate("/")
}

async function	onClickDeleteAccount(): Promise<void> {
	if (!confirm("Are you sure you want to delete your account?"))
		return ;

	const	response: Response = await sendRequest(`/api/auth/me`, 'delete', null);
	if (!response.ok)
		displayPopError(response);

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

	const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
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
	
	var menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

async function	onClickNewCode(): Promise<void> {
	const	btnSend = document.getElementById("btnSend2faCode") as HTMLButtonElement;
	const	spanCooldown = document.getElementById("btnCooldown");
	const	locks = document.querySelectorAll(".lock");

	if (btnSend) btnSend.disabled = true;
	if (spanCooldown) spanCooldown.textContent = "(5s)";
	locks.forEach(e => (e as HTMLElement).hidden = false);

	const	res = await sendRequest('/api/jwt/twofa/recreat', 'PATCH', {});

	if (!res.ok) {
		if (btnSend) btnSend.disabled = false;
		if (spanCooldown) spanCooldown.textContent = "";
		locks.forEach(e => (e as HTMLElement).hidden = true);
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
				if (btnSend) btnSend.disabled = false;
				if (spanCooldown) spanCooldown.textContent = "";
				locks.forEach(e => (e as HTMLElement).hidden = true);
				displayPopError(response);
				return;
			}
		}
	);

	loadTwofa();
}

/* ====================== UI TOGGLE HELPERS ====================== */

function showDifficultyMenu() {
	const	mainBtns = document.getElementById('main-menu-btns');
	const	diffBtns = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.add('hidden');
		diffBtns.classList.remove('hidden');
	}
}

function hideDifficultyMenu() {
	const	mainBtns = document.getElementById('main-menu-btns');
	const	diffBtns = document.getElementById('difficulty-btns');
	
	if (mainBtns && diffBtns) {
		mainBtns.classList.remove('hidden');
		diffBtns.classList.add('hidden');
	}
}

function switchGameMode(mode: 'default' | 'featured') {
	const	defDiv = document.getElementById('default-mode-content');
	const	inputDiv = document.getElementById('default-mode-content-input');
	const	featDiv = document.getElementById('featured-mode-content');

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
	const	input = document.getElementById('aiHardcore') as HTMLInputElement;
	if (!input) return;
	input.value = level.toString();

	for (let i = 1; i <= 4; i++) {
		document.getElementById(`btn-feat-${i}`)?.classList.remove('active');
	}

	document.getElementById(`btn-feat-${level}`)?.classList.add('active');
}

/* ====================== GAME & TOURNAMENT HANDLERS ====================== */

function onClickPlayAI(difficulty: 'easy' | 'medium' | 'hard') {
	const	maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	if (!maxPointsInput) return;
	const	winningScore = parseInt(maxPointsInput.value, 10);
	
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
		if (!maxPointsInput) return;
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
		const	mapSelect = document.getElementById("mapSelect") as HTMLSelectElement;
		const	p1Select = document.getElementById("p1TankSelect") as HTMLSelectElement;
		const	p2Select = document.getElementById("p2TankSelect") as HTMLSelectElement;
		if (!mapSelect || !p1Select || !p2Select) return;
		
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
	const	inputs = document.querySelectorAll('.player-name-input') as NodeListOf<HTMLInputElement>;
	const	playerNames: Player[] = [];
	
	inputs.forEach(input => {
		if (input.value.trim() !== '') {
			playerNames.push({name: input.value.trim()});
		}
	});

	if (playerNames.length < 4) {
		alert("You need at least 4 players to start a tournament.");
		return;
	}

	if (new Set(playerNames).size !== playerNames.length) {
		displayError("Player names must be unique.", "tournament-msg-error");
		return;
	}
	const	scoreInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	if (!scoreInput) return;
	const	winningScore = parseInt(scoreInput.value, 10);

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
	const	freqInput = document.getElementById("powerupFreq") as HTMLInputElement;
	
	const	star1 = (document.getElementById("chk-1star") as HTMLInputElement)?.checked;
	const	star2 = (document.getElementById("chk-2star") as HTMLInputElement)?.checked;
	const	star3 = (document.getElementById("chk-3star") as HTMLInputElement)?.checked;

	if (!freqInput || star1 === null || star2 === null || star3 === null) return;

	const	state: AppState = appStore.getState();
	const	user: UserState | null = state.user;

	if (router.Path === '/pongmenu')
	{
		const	aiInput = document.getElementById("aiHardcore") as HTMLInputElement;
		const	pointsInput = document.getElementById("featuredMaxPoints") as HTMLInputElement;
		if (!aiInput || !pointsInput) return;
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
		const	mapSelect = document.getElementById("mapSelect") as HTMLSelectElement;
		const	p1Select = document.getElementById("p1TankSelect") as HTMLSelectElement;
		const	p2Select = document.getElementById("p2TankSelect") as HTMLSelectElement;

		if (!mapSelect || !p1Select || !p2Select ) return;
		
		const	selectedMap = mapSelect.value;
		const	p1Tank = p1Select.value;
		const	p2Tank = p2Select.value;
		const	freq = parseInt(freqInput.value,10);

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
		const	target = event.target as HTMLAnchorElement;
		if (target.tagName === 'A' && target.hasAttribute('href')) {
			event.preventDefault();
			router.navigate(target.getAttribute('href')!);
		}
	});

	document.addEventListener('input', (event) => {
		const	target = event.target as HTMLInputElement;
		if (!target) return;

		if (target.id === 'choosenMaxPoints') {
			const	display = document.getElementById('points-display');
			if (display) {
				display.innerText = target.value;
			}
		}
		
		if (target.id === 'powerupFreq') {
			const	display = document.getElementById('powerup-freq-display');
			if (display) {
				display.innerText = target.value + " sec";
			}
		}

		if (target.id === 'featuredMaxPoints') {
			const	display = document.getElementById('featured-points-display');
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
  	const	keysToBlock = [
  	  "ArrowUp", 
  	  "ArrowDown",
  	];
  	if (keysToBlock.includes(event.code)) {
  	  event.preventDefault();
  	}
});
}
