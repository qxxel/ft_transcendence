/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/05 12:18:45 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import { Router } from '../router/router.js'
import { User } from '../user/user.js'
import { PongGame } from '../game/game.js'
import { router } from '../index.js'


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, currentGame: PongGame | null, user: User): void {
	const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
	currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

	router.navigate("/play", currentGame, user);
}

function onClickLogout(router: Router, currentGame: PongGame | null, user: User, menu: string): void {
	user.logout();
	
	menu = `<nav>
		<a href="/">Home</a> | 
		<a href="/about">About</a> | 
		<a href="/settings">Settings</a> |
		<a href="/sign-in">Sign in</a> |
		<a href="/sign-up">Sign up</a> |
		<a href="/game-menu">Play</a>
	</nav>`;

	router.navigate("/", currentGame, user);
}

async function onClickGetMessage(): Promise<void> {
	const res = await fetch('/api/user/10');
	const data = await res.json();
	console.log(data);
}


export async function	setupClickHandlers(router: Router, user: User, currentGame: PongGame | null, menu: string): Promise<void> {
	(window as any).onClickPlay = () => onClickPlay(router, currentGame, user);
	(window as any).onClickLogout = () => onClickLogout(router, currentGame, user, menu);
	(window as any).onClickGetMessage = onClickGetMessage;
	
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
