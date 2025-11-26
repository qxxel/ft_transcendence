/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/26 17:59:41 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND

/* ====================== IMPORTS ====================== */

import { addRoutes }			from "./router/addRoutes.js"
import { Game } 				from './Pong/GameClass.js'
import { TournamentController } from "./tournament.js"
import { Router }				from "./router/router.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"
import { User }					from "./user/user.js"


/* ====================== INTERFACE ====================== */

export interface	GameState {
	currentGame: Game | null;
	currentTournament: TournamentController | null;
};


/* ====================== INTERFACE ====================== */

import { io } from "socket.io-client"; // <--- C'est ici

const socket = io("https://localhost:8080", {
    path: "/game/socket.io",
    transports: ["websocket"]
});


/* ====================== GLOBAL VARIABLES ====================== */

var	gameState: GameState = {
	currentGame: null,
	currentTournament: null
};

var	user: User = new User();

export const	router: Router = new Router();


/* ============================= SETUP EVENTS ============================= */

setupClickHandlers(router, user, gameState);
setupSubmitHandler(gameState, user);
setupLoadHandler(gameState, user);


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render(gameState, user);
