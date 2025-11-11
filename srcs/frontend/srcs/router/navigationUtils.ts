/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   navigationUtils.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/11 15:01:29 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORT ====================== */

import { PongGame } from "../game/game.js";
import { User } from "../user/user.js";
import { router } from "../index.js";
import { GameState } from "../index.js";


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
