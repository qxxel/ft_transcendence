/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 01:02:47 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS


/* ====================== IMPORTS ====================== */

import { Router }			from "../router/router.js"
import { User }				from "../user/user.js"

import type { GameState }	from "../index.js"


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, gameState: GameState, user: User): void {
	const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	gameState.currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/play", gameState, user);
}

async function	onClickLogout(router: Router, gameState: GameState, user: User): Promise<void> {
	const response = await fetch('/api/auth/logout', {
		method: 'DELETE',
		credentials: 'include'
	});

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
				<a href="/game-menu">Play</a>
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


export async function	setupClickHandlers(router: Router, user: User, gameState: GameState): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay(router, gameState, user);
	(window as any).onClickLogout = () => onClickLogout(router, gameState, user);
	(window as any).onClickGetMessage = onClickGetMessage;
	(window as any).onClickValidateMessage = onClickValidateMessage;
	(window as any).onClickRefreshMessage = onClickRefreshMessage;
	
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
