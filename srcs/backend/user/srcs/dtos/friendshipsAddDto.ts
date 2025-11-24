/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsAddDto.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:48:22 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 18:16:02 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW FRIENDSHIPS


/* ====================== IMPORT ====================== */

import { SelfFriendRequestError }	from "../utils/throwErrors.js";


/* ====================== CLASS ====================== */

export class	friendshipsAddDto {
	private	requesterId: number;
	private	receiverId: number;


	constructor(row: any) {
		if (row.requesterId === row.receiverId)
			throw new SelfFriendRequestError("You cannot add yourself as a friend");

		this.requesterId = row.requesterId;
		this.receiverId = row.receiverId;
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

	getRequesterId(): number {
		return this.requesterId;
	}

	getReceiverId(): number {
		return this.receiverId;
	}
}
