/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 18:04:48 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import { Router } from '../router/router.js'
import { User } from '../user/user.js'
import { PongGame } from '../game/game.js'


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, currentGame: PongGame | null, user: User): void {
	const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/play", currentGame, user);
}

async function	onClickLogout(router: Router, currentGame: PongGame | null, user: User): Promise<void> {
	
	
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


		router.navigate("/", currentGame, user);
	} catch (err) {
		console.error("Error during logout:", err);
	}
}

async function onClickGetMessage(): Promise<void> {
	const res = await fetch('/api/jwt', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ message: "cookie created." })
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
		body: JSON.stringify({ message: "valid." })
	});
	const data = await res.json();
	console.log(data);
}

export async function	setupClickHandlers(router: Router, user: User, currentGame: PongGame | null): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay(router, currentGame, user);
	(window as any).onClickLogout = () => onClickLogout(router, currentGame, user);
	(window as any).onClickGetMessage = onClickGetMessage;
	(window as any).onClickValidateMessage = onClickValidateMessage;
	
	document.addEventListener('click', (event) => {
		const target = event.target as HTMLAnchorElement;
		if (target.tagName === 'A' && target.hasAttribute('href')) {
			event.preventDefault();
			console.log(target.getAttribute('href')!);
			router.navigate(target.getAttribute('href')!, currentGame, user);
		}
	});
	
	// Handle back/forward navigation
	window.addEventListener('popstate', () => {
		router.render(currentGame, user);
	});
}
