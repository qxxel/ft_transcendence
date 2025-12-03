/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 22:43:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND

/* ====================== IMPORTS ====================== */

import { addRoutes }					from "./router/addRoutes.js"
import { Game } 						from "./Pong/gameClass.js"
import { TournamentController } 		from "./Pong/tournament.js"
import { Router }						from "./router/router.js"
import { setupClickHandlers }			from "./eventsHandlers/clickHandler.js"
import { setupLoadHandler }				from "./eventsHandlers/loadHandler.js"
import { setupSubmitHandler }			from "./eventsHandlers/submitHandler.js"
import { User }							from "./user/user.js"

import type { GameOptions }	from "./Pong/objects/gameOptions.js"

/* ====================== INTERFACE ====================== */

export interface	AppState {
	currentGame: Game | null;
	currentTournament: TournamentController | null;
	pendingOptions?: GameOptions
};


/* ====================== GLOBAL VARIABLES ====================== */

var	gameState: AppState = {
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
