/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   postNavigationUtils.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/29 16:00:10 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO POST NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { btnCooldown }			from "../utils/buttonCooldown.js"
import { DisplayDate }			from "../utils/displayDate.js"
import { getAndRenderFriends }  from  "../friends/getAndRenderFriends.js"
import { PongGame }				from "../Pong/Pong.js"
import { router }				from "../index.js"
import { sendRequest }			from "../utils/sendRequest.js"
import { TankGame }				from "../v3/tank.js"
import { User }					from "../user/user.js"

import type { GameState }   from "../index.js"


/* ====================== FUNCTION ====================== */

export function  pathActions(currentPath: string, gameState: GameState, user: User): void {
	
	if (!['/pong', '/tank'].includes(currentPath)) {
		if (gameState.currentGame) 
			gameState.currentGame.stop();
	}
	
	if (!['/tournament-setup', '/tournament-bracket', '/pong'].includes(currentPath)) {
		gameState.currentTournament = null;
	}

	if (['/pong'].includes(currentPath)) {
		
	   if (gameState.currentTournament && gameState.currentTournament.currentMatch) {
			const match = gameState.currentTournament.currentMatch;
			
			const tournamentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);
			
			tournamentGame.setCtx();
			
			tournamentGame.setWinningScore(gameState.currentTournament.winningScore);
			tournamentGame.setPlayerNames(match.p1, match.p2);
			
			tournamentGame.start();
			gameState.currentGame = tournamentGame;
		}
		else if (gameState.currentGame) {
			gameState.currentGame.setCtx();
			gameState.currentGame.start();
		}
		
		else {
			router.navigate("/pongmenu", gameState, user);
		}
	}

	if (['/user'].includes(currentPath)) {
		loadUser(user);
	}

	if (['/2fa'].includes(currentPath)) {
		router.canLeave = false;
		btnCooldown();
		DisplayDate(5);
	}

	if (['/sign-in', '/sign-up'].includes(currentPath)) {
		if (user.isSignedIn())
			router.navigate("/", gameState, user);
	}

	if (['/pongmenu'].includes(currentPath)) {
		gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);
		
		const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
		const display = document.getElementById('points-display') as HTMLSpanElement;
		
		if (slider && display) {
		  display.innerHTML = slider.value;
		  slider.addEventListener('input', () => {
			display.innerHTML = slider.value;
		  });
		}
	}

	if (['/tournament-setup'].includes(currentPath)) {
		const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
		const display = document.getElementById('points-display') as HTMLSpanElement;
		
		if (slider && display) {
		  display.innerHTML = slider.value;
		  slider.addEventListener('input', () => {
			display.innerHTML = slider.value;
		  });
		}
	}

	if (['/tournament-bracket'].includes(currentPath)) {
		if (!gameState.currentTournament) {
			router.navigate("/tournament-setup", gameState, user);
			return;
		}

		const container = document.getElementById('bracket-container');
		if (container) {
			container.innerHTML = gameState.currentTournament.renderBracket();
		}
	}

	if (['/tank'].includes(currentPath)) {
		gameState.currentGame = new TankGame('tank-canvas', 'desertfox', 2, 'pvp', 'p1-name', 'p2-name');
		gameState.currentGame.start();
		console.log("Loading the new game...");
	}

	if (['/friends'].includes(currentPath)) {
        getAndRenderFriends();
        console.log("Loading the friends...");
    }
}

async function loadUser(user: User) {
	const	Response: Response = await sendRequest(`/api/user/${user.getId()}`, 'get', null);
		if (!Response.ok) {
			console.log(Response.statusText)
			return ;
		}
		const	userRes = await Response.json();
		
		if (userRes.is2faEnable === 'true') {
			const	switchSpan = document.getElementById("switch-span") as HTMLInputElement;
			if (switchSpan) {
				switchSpan.textContent = "Enable";
				switchSpan.classList.add('enable');
				switchSpan.classList.remove('disable');
			}
			const	checkbox2fa = document.getElementById("edit-2fa") as HTMLInputElement;
			if (checkbox2fa)
				checkbox2fa.checked = true;
		}

		const	usernameEl = document.getElementById("user-username") as HTMLSpanElement;
		const	emailEl = document.getElementById("user-email") as HTMLSpanElement;
		
		if (usernameEl && emailEl) {
			usernameEl.textContent = userRes.username ?? "";
			emailEl.textContent = userRes.email ?? "";
		}
}
