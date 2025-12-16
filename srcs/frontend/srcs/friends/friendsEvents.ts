/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendsEvents.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 16:18:04 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 10:04:43 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FUNCTIONS THAT SET THE EVENTS OF `/friends` PAGE


/* ====================== IMPORT ====================== */

import { displayPop } from "../utils/display.js";
import { handleFriendAction }	from "./handleFriendsActions.js"


/* ====================== FUNCTIONS ====================== */

export function	attachDelegationListeners(requestsListDiv: HTMLDivElement, friendsListDiv: HTMLDivElement): void {
	requestsListDiv.addEventListener('click', handleDelegatedFriendAction);
	friendsListDiv.addEventListener('click', handleDelegatedFriendAction);
}

async function	handleDelegatedFriendAction(event: Event): Promise<void> {
	const	target: EventTarget | null = event.target;

	if (!(target instanceof HTMLElement)) return ;

	if (!target.classList.contains('neon-button') && !target.classList.contains('remove-button'))
		return ;
	
	const	targetId: string | undefined = target.dataset.targetId;
	const	targetUsername: string | undefined = target.dataset.targetUsername;
	if (!targetId || !targetUsername)
		return ;

	if (target.classList.contains('accept-button'))
	{
		if (await handleFriendAction('/api/user/friends/accept/' + targetId, "PATCH", { status: "ACCEPTED" }))
			displayPop("You are now friend with " + targetUsername + ".", "success");
		return ;
	}	

	if (target.classList.contains('ignore-button'))
	{
		if (await handleFriendAction(`/api/user/friends/` + targetId, "DELETE", null))
			displayPop("You reject the request from " + targetUsername + ".", "success");
		return ;
	}

	if (target.classList.contains('remove-button'))
	{	
		if (confirm(`Are you sure to remove ${targetUsername}?`))
		{
			if (await handleFriendAction(`/api/user/friends/${targetId}`, "DELETE", null))
				displayPop("You are not friend with " + targetUsername + " anymore.", "success");
			return ;
		}
	}

	if (target.classList.contains('history-button'))
		return ;																						//	AXEL: A ENLEVER
}
