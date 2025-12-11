/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/11 19:29:33 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { AppState, appStore }	from "../objects/store.js"
import { getMenu }				from "../utils/getMenu.js"
import { router }				from "../index.js"
import { sendRequest }			from "../utils/sendRequest.js"
import { setDynamicFavicon }	from "../utils/setDynamicFavicon.js"


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

		const	baseHref: string = window.location.origin;

		const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
		if (menu)
			menu.innerHTML = getMenu(true);

		router.navigate('/');
	});
}

function handleUnload() {
	window.addEventListener("beforeunload", async (event: Event) => {
		if (!router.canLeave)
			event.preventDefault();
		return;
	});
}

function handlePagehide() {
	window.addEventListener("pagehide", async (event: Event) => {
		
		if (!router.canLeave && router.Path === "/sign-up") {
			navigator.sendBeacon("/api/auth/twofa/me", null);
		}

		appStore.setState((state) => ({
			...state,
			user: {
				id: null,
				username: null,
				avatar: null,
				isAuth: false
			}
		}));
		navigator.sendBeacon('/api/jwt/refresh/logout', null);
		
		if (socket && socket.connected)
			socket.disconnect();
	});
}

export async function	setupLoadHandler(): Promise<void> {
	handleLoadPage();
	handleUnload();
	handlePagehide();
}
