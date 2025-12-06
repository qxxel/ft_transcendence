/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendUser.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/24 14:54:51 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 16:09:19 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// OBJECT THAT CONTAINS FRIEND USER INTERFACE


/* ====================== INTERFACE ====================== */

export interface	FriendUser {
	id: number;
	username: string;
	avatar: string;
	email: string;
	status: string; 
	receiver_id: number;
	// status: string; //	A METTRE SI ON MET ONLINE OU OFFLINE EN DB
}
