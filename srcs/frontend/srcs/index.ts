/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:39:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/12 02:29:26 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MASTER FILE OF THE FRONTEND


/* ====================== IMPORTS ====================== */

import { addRoutes }			from "./router/addRoutes.js"
import { appStore }				from "./objects/store.js"
import { initFaviconSync }		from "./store/initFaviconSync.js"
import { Router }				from "./router/router.js"
import { setupClickHandlers }	from "./eventsHandlers/clickHandler.js"
import { setupLoadHandler }		from "./eventsHandlers/loadHandler.js"
import { setupSubmitHandler }	from "./eventsHandlers/submitHandler.js"
import { addTabs }	from "./utils/tabs.js"



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
