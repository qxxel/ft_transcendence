/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 14:14:41 by agerbaud         ###   ########.fr       */
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
import { Store }						from "./utils/store.js"
import { User }							from "./user/user.js"

import type { AppState }	from "./objects/store.js"
import type { GameOptions }	from "./Pong/objects/gameOptions.js"

/* ====================== INTERFACE ====================== */

export interface	GamesState {
	currentGame: Game | null;
	currentTournament: TournamentController | null;
	pendingOptions?: GameOptions
};


/* ====================== GLOBAL VARIABLES ====================== */

var	gameState: GamesState = {
	currentGame: null,
	currentTournament: null
};

export var	user: User = new User();

const initialState: AppState = {
	user: {
		id: null,
		username: null,
		avatar: null,
		isAuth: false
	},
	game: {
		currentGame: null,
		currentTournament: null,
		pendingOptions: null
	}
};

export const	appStore: Store<AppState> = new Store<AppState>(initialState);

export const	router: Router = new Router();


/* ============================= SETUP EVENTS ============================= */

setupClickHandlers(user, gameState);
setupSubmitHandler(gameState, user);
await setupLoadHandler(gameState, user);


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render(gameState, user);
