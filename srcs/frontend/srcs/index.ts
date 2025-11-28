/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/28 10:35:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND

/* ====================== IMPORTS ====================== */

import { addRoutes }			from "./router/addRoutes.js"
import { Game } 				from './game/class_game.js'
import { Router }				from "./router/router.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"
import { User }					from "./user/user.js"


/* ====================== interface	====================== */

export interface	GameState {
	currentGame: Game | null;
};


/* ====================== GLOBAL VARIABLES ====================== */

var	gameState: GameState = {
	currentGame: null
};

var	user: User = new User();

export const	router: Router = new Router();


/* ============================= SETUP EVENTS ============================= */

setupClickHandlers(router, user, gameState);
setupSubmitHandler(gameState, user);
await setupLoadHandler(gameState, user);


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render(gameState, user);
