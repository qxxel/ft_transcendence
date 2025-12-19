/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendUser.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/24 14:54:51 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:53:47 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// OBJECT THAT CONTAINS FRIEND USER INTERFACE


/* ====================== INTERFACE ====================== */

export interface	FriendUser {
	id: number;
	username: string;
	avatar: string;
	status: string; 
	receiver_id: number;
	is_log: number;
}
