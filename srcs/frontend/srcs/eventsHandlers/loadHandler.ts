/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/17 13:46:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { appStore }				from "../objects/store.js"
import { getMenu }				from "../utils/getMenu.js"
import { sendRequest }			from "../utils/sendRequest.js"
import { addTabs, delTabs }		from "../utils/tabs.js"
import { setDynamicFavicon }	from "../utils/setDynamicFavicon.js"

/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(): Promise<void> {
	return new Promise((resolve) => {
		document.addEventListener("DOMContentLoaded", async (_event: Event) => {
			addTabs()

			// const	response: Response = await sendRequest('/api/jwt/payload/access', 'GET', null);
			const	response: Response = await sendRequest('/api/user/me', "GET", null);

			if (!response.ok)
			{
				setDynamicFavicon(null);
				return resolve();
			}

			const	result: any = await response.json();

			appStore.setState((state) => ({
				...state,
				user: {
					id: result.id as number,
					username: result.username,
					avatar: result.avatar,
					pendingAvatar: null,
					isAuth: true
				}
			}));

			setDynamicFavicon(result.avatar ?? null);

			getMenu(true);

			resolve();
		});
	});
}

function handleUnload() {
	window.addEventListener("beforeunload", (_event: Event) => { delTabs() });
}

function handlePagehide() {
	window.addEventListener("pagehide", (event: PageTransitionEvent) => {
		if (event.persisted)
			delTabs()
	});
}

export async function	setupLoadHandler(): Promise<void> {
	await handleLoadPage();
	handleUnload();
	handlePagehide();
}
