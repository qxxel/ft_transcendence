/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   navigationUtils.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 01:07:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO NAVIGATION ARE LOCATED HERE


/* ====================== IMPORT ====================== */

import { PongGame } from "../game/game.js";
import { User }		from "../user/user.js";
import { router }	from "../index.js";

import type { GameState }	from "../index.js";


/* ====================== FUNCTIONS ====================== */

export function  pathActions(currentPath: string, gameState: GameState, user: User): void {
	if (['/game-menu'].includes(currentPath)) {
		gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
	}

	if (['/play'].includes(currentPath)) {
		if (!gameState.currentGame)
			router.navigate("/game-menu", gameState, user);
		else {
			gameState.currentGame.setCtx();
			gameState.currentGame.start();
		}
	}

	if (['/sign-in', '/sign-up'].includes(currentPath)) {
		if (user.isSignedIn())
			router.navigate("/", gameState, user);
	}
}

// function  pathActions(currentPath: string) {
//   if (['/gamemenu'].includes(currentPath)) {
//     currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');

//     const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
//     const display = document.getElementById('points-display') as HTMLSpanElement;
    
//     if (slider && display) {
//       display.innerHTML = slider.value;
      
//       slider.addEventListener('input', () => {
//         display.innerHTML = slider.value;
//       });
//     }
//   }

//   if (['/play'].includes(currentPath)) {
//     if (!currentGame)
//       router.navigate('/gamemenu');
//     else {
//       currentGame.setCtx();
//       currentGame.start();
//     }
//   }

//   if (['/tank'].includes(currentPath)) {
//     var currentTank = new TankGame('pong-canvas', 'score1', 'score2', 'winning-points');
//     currentTank.setCtx();
//     currentTank.start();
//     console.log("Loading the new game...");
//   }
// }