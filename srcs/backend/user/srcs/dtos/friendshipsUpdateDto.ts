/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsUpdateDto.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/24 13:43:27 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 13:45:08 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR UPDATES OF USER STATS


/* ====================== IMPORT ====================== */

import { SelfFriendRequestError }	from "../utils/throwErrors.js";


/* ====================== CLASS ====================== */

export class	friendshipsUpdateDto {
	private	requesterId: number;
	private	receiverId: number;
	private	status: string;


	constructor(row: any) {
		if (row.requesterId === row.receiverId)
			throw new SelfFriendRequestError("You cannot add yourself as a friend");

		this.requesterId = row.requesterId;
		this.receiverId = row.receiverId;
		this.status = row.status;
	}


	getTable(): [number, number, string] {
		return [
			this.requesterId,
			this.receiverId,
			this.status
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
