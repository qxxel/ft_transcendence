/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:25:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND


/* ====================== IMPORTS ====================== */

import { addRoutes }			from "./router/addRoutes.js"
import { initFaviconSync }		from "./store/initFaviconSync.js"
import { initNotificationSync }	from "./store/initNotificationSync.js"
import { Router }				from "./router/router.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"
import { displayPop } from "./utils/display.js"


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