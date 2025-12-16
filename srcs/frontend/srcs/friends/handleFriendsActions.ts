/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   handleFriendsActions.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:48:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 10:05:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ALL FRIENDS ACTION: POST, PATCH, DELETE


/* ====================== IMPORTS ====================== */

import { sendRequest }			from "../utils/sendRequest.js"
import { displayPop }			from "../utils/display.js";
import { getAndRenderFriends }	from "./getAndRenderFriends.js"


/* ====================== FUNCTION ====================== */

export async function	handleFriendAction(url: string, method: string, body: Object | null): Promise<boolean> {
	const	response: Response = await sendRequest(url, method, body);

	if (!response.ok)
	{
		displayPop(response, "error");
		return false;
	}

	await getAndRenderFriends();
	return true;
}
