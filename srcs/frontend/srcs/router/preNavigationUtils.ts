/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   preNavigationUtils.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 17:53:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 17:04:36 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO PRE NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { router }		from "../index.js"
import { appStore }		from "../objects/store.js"
import { getMenu }		from "../utils/getMenu.js"
import { sendRequest }	from "../utils/sendRequest.js"


/* ====================== FUNCTION ====================== */

export async function	preNavigation(currentPath: string): Promise<void> {
	const	respToken: Response = await sendRequest('/api/jwt/validate', 'GET', null);
	if (!respToken.ok)
		console.error((await respToken.json()).error);														//	AXEL: A VERIFIER

	redirections(currentPath);
}

export async function	redirections(currentPath: string): Promise<void> {
	if (['/friends', '/user'].includes(currentPath))
	{
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
			menu.innerHTML = getMenu(true);

		router.navigate('/');
	}
}