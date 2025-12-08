/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/06 21:46:36 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { appStore }		from "../objects/store.js"
import { getMenu }		from "../utils/getMenu.js"
import { router }		from "../index.js"
import { sendRequest }	from "../utils/sendRequest.js"


/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(): Promise<void> {
	document.addEventListener("DOMContentLoaded", async (event: Event) => {
		console.log("DOMContentLoaded");

		const	response: Response = await sendRequest('/api/jwt/payload/access', 'GET', null);

		if (!response.ok)
			return;

		const	result: any = await response.json();

		appStore.setState((state) => ({
			...state,
			user: {
				...state.user,
				id: result.id as number,
				username: result.username,
				isAuth: true
			}
		}));

		const baseHref = window.location.origin;

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
