/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:07:20 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND


/* ====================== IMPORTS ====================== */

import { addTabs }	            from "./utils/tabs.js"
import { Router }				from "./router/router.js"
import { addRoutes }			from "./router/addRoutes.js"
import { initFaviconSync }		from "./store/initFaviconSync.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"



/* ====================== ROUTER ====================== */

export const	router: Router = new Router();


/* ============================= STORE TABS ============================= */

addTabs()


/* ============================= SETUP EVENTS ============================= */

initFaviconSync();
setupClickHandlers();
setupSubmitHandler();
await setupLoadHandler();


/* ============================= SETUP ROUTES ============================= */

addRoutes();


/* ============================= FIRST RENDER ============================= */

router.render();
