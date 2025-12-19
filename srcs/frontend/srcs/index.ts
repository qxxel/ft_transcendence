/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 09:03:17 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND


/* ====================== IMPORTS ====================== */

import { Router }				from "./router/router.js"
import { displayPop }			from "./utils/display.js"
import { addRoutes }			from "./router/addRoutes.js"
import { initFaviconSync }		from "./store/initFaviconSync.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { initNotificationSync }	from "./store/initNotificationSync.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"


/* ====================== ROUTER ====================== */

export const	router: Router = new Router();

/* ============================= SETUP EVENTS ============================= */

try {
	await setupLoadHandler();
	initFaviconSync();
	initNotificationSync();
	await setupClickHandlers();
	setupSubmitHandler();


/* ============================= SETUP ROUTES ============================= */

	addRoutes();


/* ============================= FIRST RENDER ============================= */

	router.render();

} catch (error: unknown) {
    displayPop("error", "id-error", error);
}