/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   handleFriendsActions.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:48:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 05:38:58 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ALL FRIENDS ACTION: POST, PATCH, DELETE


/* ====================== IMPORTS ====================== */

import { sendRequest }			from "../utils/sendRequest.js"
import { getAndRenderFriends }	from "./getAndRenderFriends.js"


/* ====================== FUNCTION ====================== */

export async function	handleFriendAction(url: string, method: string, body: Object | null, success: string) {
	const	response: Response = await sendRequest(url, method, body);

	if (!response.ok)
	{
		const	errorData: any = await response.json();
		console.error("Error: ", errorData.error);
		return ;
	}

	console.log(success);
	await getAndRenderFriends();
}
