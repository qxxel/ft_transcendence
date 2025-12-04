/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   preNavigationUtils.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 17:53:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 12:54:13 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO PRE NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { router }		from "../index.js"
import { sendRequest }	from "../utils/sendRequest.js"
import { User }			from "../user/user.js"

import type { GamesState }	from "../index.js"


/* ====================== FUNCTION ====================== */

export async function	preNavigation(currentPath: string, gameState: GamesState, user: User): Promise<void> {
	const	respToken: Response = await sendRequest('/api/jwt/validate', 'GET', null);
	if (!respToken.ok)
		console.error((await respToken.json()).error);														//	AXEL: A VERIFIER

	redirections(currentPath, gameState, user);
}

export async function	redirections(currentPath: string, gameState: GamesState, user: User): Promise<void> {
	if (['/friends', '/user'].includes(currentPath))
	{
		const	response: Response = await sendRequest('/api/jwt/validate', 'GET', null);

		if (!response.ok)
			return;

		const	result: any = await response.json();

		user.setId(result.id as number);
		user.setUsername(result.username);
		user.setSigned(true);

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

		router.navigate('/', gameState, user);
	}
}