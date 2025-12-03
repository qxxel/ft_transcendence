/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/30 19:41:04 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND

/* ====================== IMPORTS ====================== */

import { addRoutes }					from "./router/addRoutes.js"
import { connectSocket, sendKeyPress }	from "./socket/socket.js"
import { Game } 						from "./Pong/GameClass.js"
import { TournamentController } 		from "./tournament.js"
import { Router }						from "./router/router.js"
import { setupClickHandlers }			from "./eventsHandlers/clickHandler.js"
import { setupLoadHandler }				from "./eventsHandlers/loadHandler.js"
import { setupSubmitHandler }			from "./eventsHandlers/submitHandler.js"
import { User }							from "./user/user.js"

/* ====================== INTERFACE ====================== */

export interface	GameState {
	currentGame: Game | null;
	currentTournament: TournamentController | null;
};


/* ====================== INTERFACE ====================== */

connectSocket();
document.addEventListener('keydown', (event) => {
	sendKeyPress(event.key);
});

/* ====================== GLOBAL VARIABLES ====================== */

var	gameState: GameState = {
	currentGame: null,
	currentTournament: null
};

export var	user: User = new User();

export const	router: Router = new Router();


/* ============================= SETUP EVENTS ============================= */

setupClickHandlers(router, user, gameState);
setupSubmitHandler(gameState, user);
await setupLoadHandler(gameState, user);


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render(gameState, user);
