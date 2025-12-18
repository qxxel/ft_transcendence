/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/18 10:04:01 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { appStore }				from "../objects/store.js"
import { getMenu }				from "../utils/getMenu.js"
import { heartbeat }			from "../utils/heartbeat.js"
import { sendRequest }			from "../utils/sendRequest.js"
import { setDynamicFavicon }	from "../utils/setDynamicFavicon.js"

/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(): Promise<void> {
	return new Promise((resolve) => {
		document.addEventListener("DOMContentLoaded", async (_event: Event) => {

			// const	response: Response = await sendRequest('/api/jwt/payload/access', 'GET', null); TODO
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

			heartbeat();

			setDynamicFavicon(result.avatar ?? null);

			getMenu(true);

			resolve();
		});
	});
}

export async function	setupLoadHandler(): Promise<void> {
	await handleLoadPage();
}
