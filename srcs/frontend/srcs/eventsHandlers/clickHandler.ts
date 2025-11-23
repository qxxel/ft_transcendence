/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/23 06:06:12 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS


/* ====================== IMPORTS ====================== */

import { PongGame } from "../game/game.js";
import { TournamentController } from "../tournament.js";
import { Router }		from "../router/router.js"
import { sendRequest }	from "../utils/sendRequest.js"
import { User }			from "../user/user.js"

import type { GameState }	from "../index.js"


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, gameState: GameState, user: User): void {
	const	maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	gameState.currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/pong", gameState, user);
}

async function	onClickLogout(router: Router, gameState: GameState, user: User): Promise<void> {
	const	response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

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

async function	onClickDeleteAccount(router: Router, gameState: GameState, user: User): Promise<void> {
	console.log("DeleteAccount");
	
	const	response: Response = await sendRequest(`/api/auth/me`, 'delete', null);
	if (!response.ok) {
		console.log(response.statusText);
		return ;
	}
	await onClickLogout(router, gameState, user);
}

async function onClickGetMessage(): Promise<void> {
	const	res: Response = await fetch('/api/jwt', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const	data: unknown = await res.json();
	console.log(data);
}

async function onClickValidateMessage(): Promise<void> {
	const	res: Response = await fetch('/api/jwt/validate', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const	data: unknown = await res.json();
	console.log(data);
}

async function onClickRefreshMessage(): Promise<void> {
	const	res: Response = await fetch('/api/jwt/refresh', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
	});

	const	data: unknown = await res.json();
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
	(window as any).onClickEdit = () => onClickEdit(user);
	(window as any).onClickCancel = () => onClickCancel(user);
	(window as any).onClickDeleteAccount = () => onClickDeleteAccount(router, gameState, user);
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

	// HANDLE BACK/FORWARD NAVIGATION
	window.addEventListener('popstate', () => {
		router.render(gameState, user);
	});
}
