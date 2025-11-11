/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/11 14:58:29 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import { Router } from '../router/router.js'
import { User } from '../user/user.js'
import { PongGame } from '../game/game.js'
import { GameState } from '../index.js';


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, gameState: GameState, user: User): void {
	const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	gameState.currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/play", gameState, user);
}

async function	onClickLogout(router: Router, gameState: GameState, user: User): Promise<void> {
	try {
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include' // important pour envoyer le cookie
		});
		
		if (!response.ok) {
			throw new Error('Logout failed');
		}

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
	} catch (err) {
		console.error("Error during logout:", err);
	}
}

async function onClickGetMessage(): Promise<void> {
	const res = await fetch('/api/user/10', {
		method: "GET",
		credentials: "include" // <- envoie les cookies cross-origin
	});
	const data = await res.json();
	console.log(data);
}

export async function	setupClickHandlers(router: Router, user: User, gameState: GameState): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay(router, gameState, user);
	(window as any).onClickLogout = () => onClickLogout(router, gameState, user);
	(window as any).onClickGetMessage = onClickGetMessage;
	
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
