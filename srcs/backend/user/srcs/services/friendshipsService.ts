/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsService.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/22 14:02:53 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 13:45:41 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL FRIENDSHIPS REPOSITORY FUNCTIONS


/* ====================== IMPORTS ====================== */

import { friendshipsAddDto }		from "../dtos/friendshipsAddDto.js"
import { friendshipsRepository }	from "../repositories/friendshipsRepository.js"
import { friendshipsRespDto }		from "../dtos/friendshipsRespDto.js"
import { friendshipsUpdateDto }		from "../dtos/friendshipsUpdateDto.js";

import { AlreadyRelatedError, BlockedError, NoRequestPendingError }	from "../utils/throwErrors.js"


/* ====================== CLASS ====================== */

export class	friendshipsService {
	private	friendshipsRepo: friendshipsRepository;

	constructor(friendshipsRepo: friendshipsRepository) {
		this.friendshipsRepo = friendshipsRepo;
	}


	async addFriendRequest(friendship: friendshipsAddDto): Promise<friendshipsRespDto> {
		const	status: string | null = await this.friendshipsRepo.getRelationStatus(friendship.getCheckTable());

		if (status)
		{
			if (status === "BLOCKED")
				throw new BlockedError("This user blocked you or you blocked him.");
			if (status === "ACCEPTED")
				throw new AlreadyRelatedError("You are already friends or a request is pending.");
			throw new Error("A request already exist.");
		}

		return await this.friendshipsRepo.addFriendRequest(friendship);
	}

	async acceptRequest(friendship: friendshipsUpdateDto): Promise<friendshipsRespDto> {
		const	status: string | null = await this.friendshipsRepo.getRelationStatus(friendship.getCheckTable());

		if (status !== 'PENDING')
		{
			if (!status)
				throw new NoRequestPendingError("No relation yet with this user, try to send him a friend request.");
			if (status === "BLOCKED")
				throw new BlockedError("This user blocked you or you blocked him.");
			if (status === "ACCEPTED")
				throw new AlreadyRelatedError("You are already friends or a request is pending.");
		}

		return await this.friendshipsRepo.acceptFriendRequest(friendship);
	}
}
