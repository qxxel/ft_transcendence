/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   handleFriendsActions.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:48:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/28 16:54:26 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ALL FRIENDS ACTION: POST, PATCH, DELETE


/* ====================== IMPORTS ====================== */

import { getAndRenderFriends }	from "./getAndRenderFriends.js";
import { sendRequest }			from "../utils/sendRequest.js"


/* ====================== FUNCTION ====================== */

export async function	handleFriendAction(url: string, method: string, body: Object | null, success: string) {
	const response = await sendRequest(url, method, body);

	if (!response.ok)
	{
		const errorData: any = await response.json();
		console.error("Error: ", errorData.error);
		return ;
	}

	console.log(success);
	await getAndRenderFriends();
}
