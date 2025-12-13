/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:40:27 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { AppState, appStore }	from "../objects/store.js"
import { getMenu }				from "../utils/getMenu.js"
import { router }				from "../index.js"
import { sendRequest }			from "../utils/sendRequest.js"
import { setDynamicFavicon }	from "../utils/setDynamicFavicon.js"
import { delTabs }				from "../utils/tabs.js"


/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(): Promise<void> {
	document.addEventListener("DOMContentLoaded", async (event: Event) => {
		console.log("DOMContentLoaded");

		// const	response: Response = await sendRequest('/api/jwt/payload/access', 'GET', null);
		const	response: Response = await sendRequest('/api/user/me', "GET", null);

		if (!response.ok)
		{
			setDynamicFavicon(null);
			return;
		}

		const	result: any = await response.json();

		appStore.setState((state) => ({
			...state,
			user: {
				id: result.id as number,
				username: result.username,
				avatar: result.avatar,
				isAuth: true
			}
		}));

		const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
		if (menu)
			menu.innerHTML = getMenu(true);

		router.navigate('/');
	});
}

function handleUnload() {
	window.addEventListener("beforeunload", (event: Event) => { delTabs() });
}

function handlePagehide() {
	window.addEventListener("pagehide", (event: PageTransitionEvent) => {
		if (event.persisted)
			delTabs()
	});
}

export async function	setupLoadHandler(): Promise<void> {
	handleLoadPage();
	handleUnload();
	handlePagehide();
}
