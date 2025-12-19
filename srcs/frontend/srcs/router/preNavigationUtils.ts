/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   preNavigationUtils.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 17:53:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 12:06:10 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO PRE NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { router }		from "../index.js"
import { displayPop } 	from "../utils/display.js"
import { sendRequest }	from "../utils/sendRequest.js"


/* ====================== FUNCTION ====================== */

export async function	preNavigationActions(currentPath: string): Promise<void> {
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
			displayPop("error", "id-error", error);
		}

		router.navigate('/');
	}
}