/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/09 23:36:24 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { appStore }				from "../objects/store.js"
import { getMenu }				from "../utils/getMenu.js"
import { notificationService }	from "../utils/notifService.js"
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

		notificationService.connect();

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

export async function	setupLoadHandler(): Promise<void> {
	handleLoadPage();
	handleUnload();
}
