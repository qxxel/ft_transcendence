/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   handleFriendsActions.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:48:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:25:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ALL FRIENDS ACTION: POST, PATCH, DELETE


/* ====================== IMPORTS ====================== */

import { sendRequest }			from "../utils/sendRequest.js"
import { displayPop }			from "../utils/display.js";
import { getAndRenderFriends }	from "./getAndRenderFriends.js"


/* ====================== FUNCTION ====================== */

export async function	handleFriendAction(url: string, method: string, body: Object | null): Promise<boolean> {

	try {
		const	response: Response = await sendRequest(url, method, body);
		if (!response.ok)
		{
			displayPop("error", "id-error", response);
			return false;
		}
	} catch (error: unknown) {
		displayPop("error", "id-error", error);
		return false;
	}
	await getAndRenderFriends();
	return true;
}
