/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:58:56 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { router }		from "../index.js"
import { sendRequest }	from "../utils/sendRequest.js"
import { User }			from "../user/user.js"

import type { GameState }	from "../index.js"


/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(gameState: GameState, user: User): Promise<void> {
	document.addEventListener("DOMContentLoaded", async (event: Event) => {
		console.log("DOMContentLoaded");

		const	response: Response = await sendRequest('/api/jwt/validate', 'GET', null);

		if (!response.ok)
			return;

		const	result: any = await response.json();

		user.setId(result.id as number);
		user.setUsername(result.username);
		user.setSigned(true);

		var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
		if (menu)
			menu.innerHTML =
				`<a href="/">Home</a>
				<a href="/games">Play</a>
				<a href="/tournament-setup">Tournament</a>
				<a href="/user">${user.getUsername()}</a>
				<button onclick="onClickLogout();" id="logout">Logout</button>
				<a href="/settings">Settings</a>
				<a href="/about">About</a>`;

		router.navigate("/", gameState, user);
	});
}

export function	setupLoadHandler(gameState: GameState, user: User): void {
	handleLoadPage(gameState, user)
}