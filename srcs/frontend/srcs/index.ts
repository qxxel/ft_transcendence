/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 07:55:35 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND

/* ====================== IMPORTS ====================== */

import { Router }				from "./router/router.js"
import { addRoutes }			from "./router/addRoutes.js"
import { initFaviconSync }		from "./store/initFaviconSync.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"


/* ====================== ROUTER ====================== */

export const	router: Router = new Router();


/* ============================= SETUP EVENTS ============================= */

await setupLoadHandler();
initFaviconSync();
setupClickHandlers();
setupSubmitHandler();


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render();
