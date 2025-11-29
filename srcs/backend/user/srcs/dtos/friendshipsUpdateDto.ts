/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsUpdateDto.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/24 13:43:27 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/26 22:58:41 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR UPDATES OF USER STATS


/* ====================== IMPORT ====================== */

import { SelfFriendRequestError }	from "../utils/throwErrors.js";


/* ====================== CLASS ====================== */

export class	friendshipsUpdateDto {
	private	requesterId: number;
	private	receiverId: number;


	constructor(userId: number, targetId: number) {
		if (userId === targetId)
			throw new SelfFriendRequestError("You cannot change the status of a request form yourself to yourself.");

		this.requesterId = userId;
		this.receiverId = targetId;
	}


	getTable(): [number, number] {
		return [
			this.requesterId,
			this.receiverId
		];
	}

	getCheckTable(): [number, number, number, number] {
		return [
			this.requesterId,
			this.receiverId,
			this.receiverId,
			this.requesterId
		];
	}
}
