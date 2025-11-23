/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   navigationUtils.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/23 05:23:23 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { PongGame }	from "../game/game.js";
import { router }	from "../index.js";
import { TankGame }	from "../v3/tank.js";
import { User }		from "../user/user.js";
import { sendRequest }	from "../utils/sendRequest.js"

import type { GameState }	from "../index.js"


/* ====================== FUNCTION ====================== */

export function  pathActions(currentPath: string, gameState: GameState, user: User): void {
	if (!['/pong', '/tank'].includes(currentPath)) {
		if (gameState.currentGame) 
			gameState.currentGame.stop();
	}

	if (['/pong'].includes(currentPath)) {
		if (!gameState.currentGame)
			router.navigate("/pongmenu", gameState, user);
		else {
			gameState.currentGame.setCtx();
			gameState.currentGame.start();
		}
	}

	if (['/sign-in', '/sign-up'].includes(currentPath)) {
		if (user.isSignedIn())
			router.navigate("/", gameState, user);
	}

	if (['/pongmenu'].includes(currentPath)) {
		gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
		const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
		const display = document.getElementById('points-display') as HTMLSpanElement;
		
		if (slider && display) {
		display.innerHTML = slider.value;
		
		slider.addEventListener('input', () => {
			display.innerHTML = slider.value;
		});
		}
	}

	if (['/tank'].includes(currentPath)) {
		gameState.currentGame = new TankGame('pong-canvas', 'desertfox', 4);
		gameState.currentGame.start();
		console.log("Loading the new game...");
	}

	if (['/user'].includes(currentPath)) {
		loadUser(user);
	}
}

async function loadUser(user: User) {
	const	Response: Response = await sendRequest(`/api/user/${user.getId()}`, 'get', null);
		if (!Response.ok) {
			console.log(Response.statusText)
			return ;
		}
		const	userRes = await Response.json();
		const	switchSpan = document.getElementById("switch-span") as HTMLInputElement;
		
		if (switchSpan && userRes.is2faEnable) {
			switchSpan.textContent = "Enable";
			switchSpan.classList.add('enable');
			switchSpan.classList.remove('disable');
		}

		const	usernameEl = document.getElementById("user-username") as HTMLSpanElement;
		const	emailEl = document.getElementById("user-email") as HTMLSpanElement;
		
		if (usernameEl && emailEl) {
			usernameEl.textContent = userRes.username ?? "";
			emailEl.textContent = userRes.email ?? "";
		}
}

export async function  sendActionsRequest(currentPath: string): Promise<void> {
	if (['/2fa'].includes(currentPath)) {
		const response = await sendRequest('/api/twofa/otp', 'GET', null);
		if (!response.ok) {
			console.log(response.statusText)
			return;
		}
	}

}
// function  pathActions(currentPath: string) {
//   if (['/pongmenu'].includes(currentPath)) {
//     currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');

// 		const	slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
// 		const	display = document.getElementById('points-display') as HTMLSpanElement;
		
// 		if (slider && display) {
// 			display.innerHTML = slider.value;
			
// 			slider.addEventListener('input', () => {
// 				display.innerHTML = slider.value;
// 			});
// 		}
// 	}

//   if (['/play'].includes(currentPath)) {
//     if (!currentGame)
//       router.navigate('/pongmenu');
//     else {
//       currentGame.setCtx();
//       currentGame.start();
//     }
//   }

// 	if (['/tank'].includes(currentPath)) {
// 		var	currentTank = new TankGame('pong-canvas', 'score1', 'score2', 'winning-points');
// 		currentTank.setCtx();
// 		currentTank.start();
// 		console.log("Loading the new game...");
// 	}
// }