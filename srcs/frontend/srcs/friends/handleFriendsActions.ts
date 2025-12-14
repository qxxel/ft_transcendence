/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   handleFriendsActions.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:48:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:09:22 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ALL FRIENDS ACTION: POST, PATCH, DELETE


/* ====================== IMPORTS ====================== */

import { sendRequest }			from "../utils/sendRequest.js"
import { getAndRenderFriends }	from "./getAndRenderFriends.js"


/* ====================== FUNCTION ====================== */

export async function	handleFriendAction(url: string, method: string, body: Object | null, success: string) {
	const	response = await sendRequest(url, method, body);

	if (!response.ok)
	{
		const	errorData: any = await response.json();
		console.error("Error: ", errorData.error);
		return ;
	}

	console.log(success);
	await getAndRenderFriends();
}
