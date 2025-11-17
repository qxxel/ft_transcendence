/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 21:44:30 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND


/* ====================== IMPORTS ====================== */

import { PongGame } 			from "./game/game.js";
import { User } 				from "./user/user.js";
import { Router } 				from "./router/router.js";
import { setupClickHandlers } 	from "./eventsHandlers/clickHandler.js"
import { setupSubmitHandler } 	from "./eventsHandlers/submitHandler.js"
import { setupLoadHandler } 	from "./eventsHandlers/loadHandler.js"
import { addRoutes }			from "./router/addRoutes.js"


/* ====================== INTERFACE ====================== */

export interface	GameState {
	currentGame: PongGame | null;
};


/* ====================== GLOBAL VARIABLES ====================== */

var	gameState: GameState = {
	currentGame: null
};


var user = new User();


export const	router = new Router();


/* ============================= SETUP EVENTS ============================= */

setupClickHandlers(router, user, gameState);
setupSubmitHandler(gameState, user);
setupLoadHandler(gameState, user);


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render(gameState, user);
