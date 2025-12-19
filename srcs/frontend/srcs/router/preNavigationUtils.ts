/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   preNavigationUtils.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 17:53:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:31:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO PRE NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { router }		from "../index.js"
import { displayPop } from "../utils/display.js";
import { sendRequest }	from "../utils/sendRequest.js"


/* ====================== FUNCTION ====================== */

export async function	preNavigation(currentPath: string): Promise<void> {

	try {
		const	respToken: Response = await sendRequest('/api/jwt/payload/access', 'GET', null);
		if (!respToken.ok)
			displayPop("error", respToken);
	} catch (error: unknown) {
		displayPop("error", error);
	}
	redirections(currentPath);
}

export async function	redirections(currentPath: string): Promise<void> {
	if (['/friends', '/user', '/history'].includes(currentPath))
	{
		let	response: Response;
		try {
			response = await sendRequest('/api/jwt/payload/access', 'GET', null);
			if (response.ok)
				return;
		} catch (error: unknown) {
			displayPop("error", error);
		}

		router.navigate('/');
	}
}