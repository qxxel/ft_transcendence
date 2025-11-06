/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   navigationUtils.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/05 11:47:35 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORT ====================== */

import { PongGame } from "../game/game.js";
import { User } from "../user/user.js";
import { router } from "../index.js";


/* ====================== FUNCTIONS ====================== */

// function stopCurrentGame(currentGame: PongGame | null) {
// 	if (currentGame) {
// 		currentGame.stop();
// 		currentGame = null;
// 	}
// }

export function  pathActions(currentPath: string, currentGame: PongGame | null, user: User): void {
	if (['/game-menu'].includes(currentPath)) {
		currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
	}

	if (['/play'].includes(currentPath)) {
		if (!currentGame)
			router.navigate("/game-menu", currentGame, user);
		else {
			currentGame.setCtx();
			currentGame.start();
		}
	}

	if (['/sign-in', '/sign-up'].includes(currentPath)) {
		if (user.isSignedIn())
			router.navigate("/", currentGame, user);
	}
}
