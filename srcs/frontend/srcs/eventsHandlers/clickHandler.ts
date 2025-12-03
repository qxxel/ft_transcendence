/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 23:34:05 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS

/* ====================== IMPORTS ====================== */

import { GameOptions }			from "../Pong/objects/gameOptions.js"
import { getAndRenderHistory }	from "../history/getAndRenderHistory.js"
import { PongGame }				from "../Pong/pong.js"
import { TankGame } 			from "../v3/tank.js"
import { TournamentController } from "../Pong/tournament.js"
import { Router }				from "../router/router.js"
import { sendRequest }			from "../utils/sendRequest.js"
import { socket }				from "../socket/socket.js"
import { User }					from "../user/user.js"
import { displayDate }			from "../utils/displayDate.js"
import { btnCooldown }			from "../utils/buttonCooldown.js"

import type { AppState }	from "../index.js"
import { Tank }				from "../v3/class_tank.js"


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, gameState: AppState, user: User): void {
	const	maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	gameState.currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/pong", gameState, user);
}

async function  onClickLogout(router: Router, gameState: AppState, user: User): Promise<void> {
	const   response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

	if (!response.ok)
		throw new Error('Logout failed');

	user.logout();

	const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML =
			`<a href="/">Home</a>
			<a href="/games">Play</a>
			<a href="/tournament-setup">Tournament</a>
			<a href="/sign-in">Sign in</a>
			<a href="/sign-up">Sign up</a>
			<a href="/about">About</a>`;
			
	if (socket && socket.connected)
		socket.disconnect();

	router.navigate("/", gameState, user);
}
	
async function	onClickEdit(user: User): Promise<void> {
	console.log("Edit");

	const	response: Response = await sendRequest(`/api/user/${user.getId()}`, 'get', null);
	if (!response.ok) {
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

async function	onClickHistory(targetName: string | null, router: Router, gameState: AppState, user: User): Promise<void> {
	console.log("Empty History"); /////////////////////
	// TODO: secure l'acces a la page si on est pas connecte

	router.navigate("/history", gameState, user);

	getAndRenderHistory(targetName);	//	ADD BOOLEAN FOR FILTERS ('ai' OR 'pvp')
}

function	onClickCancel(user: User): void {
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

async function	onClickDeleteAccount(router: Router, gameState: AppState, user: User): Promise<void> {
	console.log("DeleteAccount");
	
	if (!confirm("Are you sure you want to delete your account?"))
		return ;

	const	response: Response = await sendRequest(`/api/auth/me`, 'delete', null);
	if (!response.ok) {
		console.log(response.statusText);
		return ;
	}
	await onClickLogout(router, gameState, user);
}

async function	onClickDeleteTwofa(router: Router, gameState: AppState, user: User): Promise<void> {
	console.log("DeleteTwofa");
	
	if (!confirm("Are you sure you want to go back?"))
		return ;
}

async function	onClickSkipeVerifyEmailDev(router: Router, gameState: AppState, user: User): Promise<void> {
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

	user.setSigned(true);
	
	var menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML =
			`<a href="/">Home</a>
			<a href="/games">Play</a>
			<a href="/tournament-setup">Tournament</a>
			<a href="/user">Profile</a>
			<a onclick="onClickLogout();" id="logout">Logout</a>
			<a href="/about">About</a>`;

	router.canLeave = true;
	router.navigate("/", gameState, user);
}

async function	onClickNewCode(router: Router, gameState: AppState, user: User): Promise<void> {
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
	
	// Si le statut est 204 (No Content), on laisse le corps vide.
	// Si Content-Length est absent ou égal à 0, on considère qu'il n'y a pas de corps à lire.
	const contentLength = res.headers.get('Content-Length');
	
	if (res.status === 204 || contentLength === '0' || contentLength === null) {
		data = { message: `Action réussie. (Statut ${res.status})` }; 
	} else {
		// Le serveur a indiqué qu'il y a du contenu (200, 201), on lit le JSON.
		try {
			 data = await res.json();
		} catch (e) {
			// Sécurité supplémentaire : s'il y a un corps mais que ce n'est pas du JSON valide
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

function onClickPlayAI(difficulty: 'easy' | 'medium' | 'hard', router: Router, gameState: AppState, user: User) {
	const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	const winningScore = parseInt(maxPointsInput.value, 10);
	
	
	const	options: GameOptions = {
		width: 800,
		height: 600,
		isTournament: false,
		p1name: user.getUsername() || "Player 1",
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
	// this.player1Name = this.user.getUsername() || "Player 1";
	// 		this.player2Name = ;

	gameState.pendingOptions = options;

	gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);
	gameState.currentGame.setWinningScore(winningScore);
	
	router.navigate("/pong", gameState, user);
}

function onClickPlayPVP(router: Router, gameState: AppState, user: User) {

	if (router.Path === '/pongmenu') {
		const	maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;
		const	winningScore: number = parseInt(maxPointsInput.value, 10);


		const	options: GameOptions = {
			width: 800,
			height: 600,
			isTournament: false,
			p1name: user.getUsername() || "Player 1",
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

		gameState.pendingOptions = options;

		gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);
		gameState.currentGame.setWinningScore(winningScore);
		router.navigate("/pong", gameState, user);
	}
	else if (router.Path === '/tankmenu')
	{
		gameState.currentGame = new TankGame('tank-canvas', 'desertfox', router, user);
		router.navigate("/tank", gameState, user);
	}
}

function	onStartTournament(router: Router, gameState: AppState, user: User) {
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

	gameState.currentTournament = new TournamentController(playerNames, winningScore);

	router.navigate("/tournament-bracket", gameState, user);
}

function startTournamentMatch(matchId: string, p1: string, p2: string, router: Router, gameState: AppState, user: User) {
	if (gameState.currentTournament) {
		const	options: GameOptions = {
			width: 800,
			height: 600,
			isTournament: true,
			p1name: p1,
			p2name: p2,
			mode: "pvp",
			difficulty: "medium",
			winningScore: gameState.currentTournament.winningScore,
			powerUpFreq: 0,
			activePowerUps: { star1: false, star2: false, star3: false }
		};

		gameState.pendingOptions = options;

		gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);

		gameState.currentTournament.startMatch(matchId, p1, p2);

		router.navigate('/pong', gameState, user);
	}
}

function onClickStartFeatured(mode: 'ai' | 'pvp', router: Router, gameState: AppState, user: User) {
	const freqInput = document.getElementById("powerupFreq") as HTMLInputElement;
	const aiInput = document.getElementById("aiHardcore") as HTMLInputElement;
	const pointsInput = document.getElementById("featuredMaxPoints") as HTMLInputElement;
	const star1 = (document.getElementById("chk-1star") as HTMLInputElement).checked;
	const star2 = (document.getElementById("chk-2star") as HTMLInputElement).checked;
	const star3 = (document.getElementById("chk-3star") as HTMLInputElement).checked;

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
			p1name: user.getUsername() || "Player 1",
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

		gameState.pendingOptions = options;

		console.log(`Starting Featured (${mode}): Freq=${freqInput.value}, Diff=${difficulty}, Stars=[${star1},${star2},${star3}]`);
		gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);
		router.navigate("/pong", gameState, user);

	}
	else if (router.Path === '/tankmenu')
	{
		console.log(`Starting Featured (${mode}): Freq=${freqInput.value}, Stars=[${star1},${star2},${star3}]`);
		const freq = parseInt(freqInput.value,10);
		gameState.currentGame = new TankGame('tank-canvas', 'desertfox', router, user, freq, star1, star2, star3);
		router.navigate("/tank", gameState, user);
	}


}

function onClickHomeBtn(router: Router, gameState: AppState, user: User) {
	router.navigate('/games', gameState, user);
}

/* ====================== SETUP ====================== */

export async function   setupClickHandlers(router: Router, user: User, gameState: AppState): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay(router, gameState, user);
	(window as any).onClickLogout = () => onClickLogout(router, gameState, user);

	(window as any).onClickEdit = () => onClickEdit(user);
	(window as any).onClickHistory = (targetName: string | null = null) => onClickHistory(targetName, router, gameState, user);
	(window as any).onClickCancel = () => onClickCancel(user);
	(window as any).onClickDeleteAccount = () => onClickDeleteAccount(router, gameState, user);
	(window as any).onClickDeleteTwofa = () => onClickDeleteTwofa(router, gameState, user);
	(window as any).onClickNewCode = () => onClickNewCode(router, gameState, user);
	(window as any).onClickSkipeVerifyEmailDev = () => onClickSkipeVerifyEmailDev(router, gameState, user);

	(window as any).onClickGetMessage = onClickGetMessage;
	(window as any).onClickValidateMessage = onClickValidateMessage;
	(window as any).onClickRefreshMessage = onClickRefreshMessage;
	(window as any).onClickBlockMessage = onClickBlockMessage;
	
	(window as any).showDifficultyMenu = showDifficultyMenu;
	(window as any).hideDifficultyMenu = hideDifficultyMenu;

	(window as any).onClickHomeBtn = () => onClickHomeBtn(router, gameState, user);

	(window as any).switchGameMode = switchGameMode;
	(window as any).onClickStartFeatured = (mode: 'ai' | 'pvp') => onClickStartFeatured(mode, router, gameState, user);
	(window as any).selectFeaturedDifficulty = selectFeaturedDifficulty;

	(window as any).onClickPlayAI = (difficulty: 'easy' | 'medium' | 'hard') => 
		onClickPlayAI(difficulty, router, gameState, user);

	(window as any).onClickPlayPVP = () => onClickPlayPVP(router, gameState, user);
	(window as any).onStartTournament = () => onStartTournament(router, gameState, user);
	
	(window as any).startTournamentMatch = (matchId: string, p1: string, p2: string) => 
		startTournamentMatch(matchId, p1, p2, router, gameState, user);


	document.addEventListener('click', (event) => {
		const target = event.target as HTMLAnchorElement;
		if (target.tagName === 'A' && target.hasAttribute('href')) {
			event.preventDefault();
			console.log(target.getAttribute('href')!);
			router.navigate(target.getAttribute('href')!, gameState, user);
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
		router.render(gameState, user);
	});

	window.addEventListener('keydown', (event: KeyboardEvent) => {
  	const keysToBlock = [
  	  "ArrowUp", 
  	  "ArrowDown",
  	];
  	if (keysToBlock.includes(event.code)) {
  	  event.preventDefault();
  	}
})	;
}