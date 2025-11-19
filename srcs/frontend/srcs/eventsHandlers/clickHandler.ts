/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 22:56:04 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS


/* ====================== IMPORTS ====================== */

import { PongGame } from "../game/game.js";
import { TournamentController } from "../tournament.js";
import { Router }		from "../router/router.js"
import { User }			from "../user/user.js"
import { sendRequest }	from "../utils/sendRequest.js";

import type { GameState }	from "../index.js"


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, gameState: GameState, user: User): void {
	const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	gameState.currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/pong", gameState, user);
}

async function	onClickLogout(router: Router, gameState: GameState, user: User): Promise<void> {
	const response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

	if (!response.ok)
		throw new Error('Logout failed');

	user.logout();

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML =
			`<nav>
				<a href="/">Home</a> | 
				<a href="/about">About</a> | 
				<a href="/settings">Settings</a> |
				<a href="/sign-in">Sign in</a> |
				<a href="/sign-up">Sign up</a> |
				<a href="/games">Play</a>
			</nav>`;

	router.navigate("/", gameState, user);
}

async function onClickGetMessage(): Promise<void> {
	const res = await fetch('/api/jwt', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const data = await res.json();
	console.log(data);
}


async function onClickValidateMessage(): Promise<void> {
	const res = await fetch('/api/jwt/validate', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const data = await res.json();
	console.log(data);
}

async function onClickRefreshMessage(): Promise<void> {
	
	const res = await fetch('/api/jwt/refresh', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const data = await res.json();
	console.log(data);
}
/////////////////////

var currentTournament: TournamentController | null = null;

function onClickPlayAI(router: Router, gameState: GameState, user: User) {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(maxPointsInput.value, 10);
  
  gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', 'ai');
  gameState.currentGame.setWinningScore(winningScore);
  
  router.navigate("/pong", gameState, user);
}

function onClickPlayPVP(router: Router, gameState: GameState, user: User) {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(maxPointsInput.value, 10);
  
  gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', 'pvp');
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

  currentTournament = new TournamentController(playerNames, winningScore);
  
  router.navigate("/tournament-bracket", gameState, user);
}

// function startTournamentMatch(matchId: string, p1: string, p2: string) {
//   if (currentTournament) {
//     currentTournament.startMatch(matchId, p1, p2);
//     router.navigate('/pong');
//   }
// }
////////////////
export async function	setupClickHandlers(router: Router, user: User, gameState: GameState): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay(router, gameState, user);
	(window as any).onClickLogout = () => onClickLogout(router, gameState, user);
	(window as any).onClickGetMessage = onClickGetMessage;
	(window as any).onClickValidateMessage = onClickValidateMessage;
	(window as any).onClickRefreshMessage = onClickRefreshMessage;
	(window as any).onClickPlayAI = () => onClickPlayAI(router, gameState, user);
	(window as any).onClickPlayPVP = () => onClickPlayPVP(router, gameState, user);
	(window as any).onStartTournament = () => onStartTournament(router, gameState, user);
	// (window as any).startTournamentMatch = () => startTournamentMatch(router, gameState, user);
	
	document.addEventListener('click', (event) => {
		const target = event.target as HTMLAnchorElement;
		if (target.tagName === 'A' && target.hasAttribute('href')) {
			event.preventDefault();
			console.log(target.getAttribute('href')!);
			router.navigate(target.getAttribute('href')!, gameState, user);
		}
	});
	
	// Handle back/forward navigation
	window.addEventListener('popstate', () => {
		router.render(gameState, user);
	});
}
