/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/06 20:35:07 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { router }		from "../index.js"
import { sendRequest }	from "../utils/sendRequest.js"
import { getMenuLog }			from "../utils/getMenu.js"
import { User }			from "../user/user.js"

import type { GameState }	from "../index.js"


/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(gameState: GameState, user: User): Promise<void> {
	document.addEventListener("DOMContentLoaded", async (event: Event) => {
		console.log("DOMContentLoaded");

		const	response: Response = await sendRequest('/api/jwt/payload/access', 'GET', null);

		if (!response.ok)
			return;

		const	result: any = await response.json();

		user.setId(result.id as number);
		user.setUsername(result.username);
		user.setSigned(true);

		const baseHref = window.location.origin;

		const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
		if (menu)
			menu.innerHTML = getMenuLog();

		router.navigate('/', gameState, user);
	});
}

function handleUnload() {
	window.addEventListener("beforeunload", async (event: Event) => {
		if (!router.canLeave)
			event.preventDefault();
		return;
	});
}

export async function	setupLoadHandler(gameState: GameState, user: User): Promise<void> {
	handleLoadPage(gameState, user);
	handleUnload();
}
