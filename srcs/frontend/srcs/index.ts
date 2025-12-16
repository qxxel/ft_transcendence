/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/10 18:31:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND


/* ====================== IMPORTS ====================== */

import { addRoutes }			from "./router/addRoutes.js"
import { appStore }				from "./objects/store.js"
import { initFaviconSync }		from "./store/initFaviconSync.js"
import { initNotificationSync }	from "./store/initNotificationSync.js"
import { Router }				from "./router/router.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"



/* ====================== ROUTER ====================== */

export const	router: Router = new Router();


/* ============================= SETUP EVENTS ============================= */

initFaviconSync();
initNotificationSync();
setupClickHandlers();
setupSubmitHandler();
await setupLoadHandler();


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render();
