/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendsEvents.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 16:18:04 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/29 14:25:50 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FUNCTIONS THAT SET THE EVENTS OF `/friends` PAGE


/* ====================== IMPORT ====================== */

import { handleFriendAction }	from "./handleFriendsActions.js"


/* ====================== FUNCTIONS ====================== */

export function	attachDelegationListeners(requestsListDiv: HTMLDivElement, friendsListDiv: HTMLDivElement): void {
	requestsListDiv.addEventListener('click', handleDelegatedFriendAction);
	friendsListDiv.addEventListener('click', handleDelegatedFriendAction);
}

async function	handleDelegatedFriendAction(event: Event): Promise<void> {
	const	target = event.target as HTMLElement;

	if (!target.classList.contains('neon-button') && !target.classList.contains('remove-button'))
		return ;
	
	const	targetId: string | undefined = target.dataset.targetId;
	const	targetUsername: string | undefined = target.dataset.targetUsername;
	if (!targetId || !targetUsername)
		return ;

	if (target.classList.contains('accept-button'))
		return await handleFriendAction('/api/user/friends/accept/' + targetId, "PATCH", { status: "ACCEPTED" }, "You are now friend with " + targetUsername + ".");

	if (target.classList.contains('ignore-button'))
		return await handleFriendAction(`/api/user/friends/` + targetId, "DELETE", null, "You reject the request from " + targetUsername + ".");

	if (target.classList.contains('remove-button'))
	{	
		if (confirm(`Are you sure to remove ${targetUsername}?`))
			return await handleFriendAction(`/api/user/friends/${targetId}`, "DELETE", null, "You are not friend with " + targetUsername + " anymore.");
	}

	if (target.classList.contains('challenge-button'))
		return ;																						//	AXEL: A FAIRE LOGIQUE 'DEFIER'
}
