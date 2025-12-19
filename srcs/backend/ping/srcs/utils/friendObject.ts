/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendObject.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 21:21:49 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:50:53 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// INTERFACE TO RECEIVE FRIENDSHIP IDS


/* ====================== IMPORTS ====================== */

export interface	FriendshipIdsObject {
	receiver_id: string;
	requester_id: string;
}
