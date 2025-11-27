/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/27 14:01:25 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS

/* ====================== IMPORTS ====================== */

import { PongGame } from "../Pong/Pong.js";
import { TournamentController } from "../tournament.js";
import { Router }       from "../router/router.js"
import { sendRequest }  from "../utils/sendRequest.js"
import { User }         from "../user/user.js"

import type { GameState }   from "../index.js"


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, gameState: GameState, user: User): void {
	const   maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	gameState.currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/pong", gameState, user);
}

async function  onClickLogout(router: Router, gameState: GameState, user: User): Promise<void> {
	const   response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

	if (!response.ok)
		throw new Error('Logout failed');

	user.logout();

	var menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML =
			`<a href="/">Home</a>
			<a href="/games">Play</a>
			<a href="/tournament-setup">Tournament</a>
			<a href="/sign-in">Sign in</a>
			<a href="/sign-up">Sign up</a>
			<a href="/settings">Settings</a>
			<a href="/about">About</a>`;

	router.navigate("/", gameState, user);
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


/* ====================== GAME & TOURNAMENT HANDLERS ====================== */

function onClickPlayAI(difficulty: 'easy' | 'medium' | 'hard', router: Router, gameState: GameState, user: User) {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(maxPointsInput.value, 10);
  
  gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user, 'ai', difficulty);
  gameState.currentGame.setWinningScore(winningScore);
  
  router.navigate("/pong", gameState, user);
}

function onClickPlayPVP(router: Router, gameState: GameState, user: User) {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(maxPointsInput.value, 10);
  
  gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user, 'pvp');
  gameState.currentGame.setWinningScore(winningScore);
  
  router.navigate("/pong", gameState, user);
}

function onStartTournament(router: Router, gameState: GameState, user: User) {
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

function startTournamentMatch(matchId: string, p1: string, p2: string, router: Router, gameState: GameState, user: User) {
  if (gameState.currentTournament) {
	gameState.currentTournament.startMatch(matchId, p1, p2);
	router.navigate('/pong', gameState, user);
  }
}

/* ====================== SETUP ====================== */

export async function   setupClickHandlers(router: Router, user: User, gameState: GameState): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay(router, gameState, user);
	(window as any).onClickLogout = () => onClickLogout(router, gameState, user);
	(window as any).onClickGetMessage = onClickGetMessage;
	(window as any).onClickValidateMessage = onClickValidateMessage;
	(window as any).onClickRefreshMessage = onClickRefreshMessage;
	(window as any).onClickBlockMessage = onClickBlockMessage;
	
	(window as any).showDifficultyMenu = showDifficultyMenu;
	(window as any).hideDifficultyMenu = hideDifficultyMenu;

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
		if (target && target.id === 'choosenMaxPoints') {
			const display = document.getElementById('points-display');
			if (display) {
				display.innerText = target.value;
			}
		}
	});

	window.addEventListener('popstate', () => {
		router.render(gameState, user);
	});
}