/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   handleFriendsActions.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:48:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/27 16:53:58 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ALL FRIENDS ACTION: POST, PATCH, DELETE


/* ====================== IMPORT ====================== */

import { getAndRenderFriends }	from "./getAndRenderFriends.js";
import { sendRequest }			from "../utils/sendRequest.js"


/* ====================== FUNCTION ====================== */

export async function	handleFriendAction(url: string, method: string, targetId: number, body: Object | null) {
	const	response: Response = await sendRequest(url, method, body);

	if (response.ok) {
		console.log(`Action ${method} success for ID ${targetId}`);
		await getAndRenderFriends();
	} else {
		console.error(`Action failed: ${response.status}`);	//	AXEL: A CHANGER
	}
}
