/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/07 16:19:50 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import { PongGame } 			from "./game/game.js";
import { User } 				from "./user/user.js";
import { Router } 				from "./router/router.js";
import { setupClickHandlers } 	from "./eventsHandlers/clickHandler.js"
import { setupSubmitHandler } 	from "./eventsHandlers/submitHandler.js"
import { setupLoadHandler } 	from "./eventsHandlers/loadHandler.js"
import { addRoutes }			from "./router/addRoutes.js"


/* ====================== GLOBAL VARIABLES ====================== */

var currentGame: PongGame | null = null;
var user = new User();

// var	menu =	`<nav>
// 						<a href="/">Home</a> | 
// 						<a href="/about">About</a> | 
// 						<a href="/settings">Settings</a> |
// 						<a href="/sign-in">Sign in</a> |
// 						<a href="/sign-up">Sign up</a> |
// 						<a href="/game-menu">Play</a>
// 					</nav>`;
export const	router = new Router();


/* ============================= SETUP EVENTS ============================= */

setupClickHandlers(router, user, currentGame);
setupSubmitHandler(currentGame, user);
setupLoadHandler(currentGame, user);

/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render(currentGame, user);
