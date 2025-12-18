/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendObject.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 21:21:49 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 21:26:34 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// INTERFACE TO RECEIVE FRIENDSHIP IDS


/* ====================== IMPORTS ====================== */

export interface	FriendshipIdsObject {
	receiver_id: string;
	requester_id: string;
}
