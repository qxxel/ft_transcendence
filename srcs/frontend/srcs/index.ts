/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 12:16:31 by agerbaud         ###   ########.fr       */
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


/* ====================== ROUTER ====================== */

export const	router: Router = new Router();


/* ============================= SETUP EVENTS ============================= */

await setupLoadHandler();
initFaviconSync();
initNotificationSync();
setupClickHandlers();
setupSubmitHandler();


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render();
