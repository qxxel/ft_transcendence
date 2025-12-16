/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   handleFriendsActions.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:48:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/10 15:22:35 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ALL FRIENDS ACTION: POST, PATCH, DELETE


/* ====================== IMPORTS ====================== */

import { getAndRenderFriends }	from "./getAndRenderFriends.js";
import { sendRequest }			from "../utils/sendRequest.js"
import { displayPop } from "../utils/display.js";


/* ====================== FUNCTION ====================== */

export async function	handleFriendAction(url: string, method: string, body: Object | null): Promise<boolean> {
	const response = await sendRequest(url, method, body);

	if (!response.ok)
	{
		displayPop(response, "error");
		return false;
	}

	await getAndRenderFriends();
	return true;
}
