/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendsEvents.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 16:18:04 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:26:08 by mreynaud         ###   ########.fr       */
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

	if (!(target instanceof HTMLElement)) return displayPop("error", "id-error", "Missing HTMLElement!");

	if (!target.classList.contains('neon-button') && !target.classList.contains('remove-button'))
		return;
	
	const	targetId: string | undefined = target.dataset.targetId;
	const	targetUsername: string | undefined = target.dataset.targetUsername;
	if (!targetId || !targetUsername)
		return displayPop("error", "id-error", "Missing Id or Username!");

	if (target.classList.contains('accept-button'))
	{
		if (await handleFriendAction('/api/user/friends/accept/' + targetId, "PATCH", { status: "ACCEPTED" }))
			displayPop("success", "id-success", "You are now friend with " + targetUsername + ".");
		return;
	}	

	if (target.classList.contains('ignore-button'))
	{
		if (await handleFriendAction(`/api/user/friends/` + targetId, "DELETE", null))
			displayPop("success", "id-success", "You reject the request from " + targetUsername + ".");
		return;
	}

	if (target.classList.contains('remove-button'))
	{	
		if (confirm(`Are you sure to remove ${targetUsername}?`))
		{
			if (await handleFriendAction(`/api/user/friends/${targetId}`, "DELETE", null))
				displayPop("success", "id-success", "You are not friend with " + targetUsername + " anymore.");
			return;
		}
	}
}
