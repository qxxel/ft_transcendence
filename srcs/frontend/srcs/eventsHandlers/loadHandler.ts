/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/04 15:37:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { appStore }		from "../objects/store.js"
import { router }		from "../index.js"
import { sendRequest }	from "../utils/sendRequest.js"


/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(): Promise<void> {
	document.addEventListener("DOMContentLoaded", async (event: Event) => {
		console.log("DOMContentLoaded");

		const	response: Response = await sendRequest('/api/jwt/validate', 'GET', null);

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

			// OLD
		// user.setId(result.id as number);
		// user.setUsername(result.username);
		// user.setSigned(true);

		const baseHref = window.location.origin;

		const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
		if (menu)
			menu.innerHTML =
				`<a href="/">Home</a>
				<a href="/games">Play</a>
				<a href="/tournament-setup">Tournament</a>
				<a href="/user">Profile</a>
				<a href="/friends">Friends</a>
				<a onclick="onClickLogout();" id="logout">Logout</a>
				<a href="/about">About</a>`;

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
