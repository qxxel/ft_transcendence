/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsService.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/22 14:02:53 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 18:38:49 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL FRIENDSHIPS REPOSITORY FUNCTIONS


/* ====================== IMPORTS ====================== */

import { friendshipsAddDto }		from "../dtos/friendshipsAddDto.js"
import { friendshipsRespDto }		from "../dtos/friendshipsRespDto.js"
import { friendshipsUpdateDto }		from "../dtos/friendshipsUpdateDto.js";
import { friendshipsRepository }	from "../repositories/friendshipsRepository.js"

import { AlreadyRelatedError, BlockedError, NoRelationError }	from "../utils/throwErrors.js"
import type { FriendUser } from "../objects/friendUser.js";


/* ====================== CLASS ====================== */

export class	friendshipsService {
	private	friendshipsRepo: friendshipsRepository;

	constructor(friendshipsRepo: friendshipsRepository) {
		this.friendshipsRepo = friendshipsRepo;
	}


	async addFriendRequest(friendship: friendshipsAddDto): Promise<friendshipsRespDto> {
		const	relation: { status: string, requester_id: number | string} | null = await this.friendshipsRepo.getRelationStatus(friendship.getCheckTable());

		if (relation && relation.status)
		{
			if (relation.status === "BLOCKED")
				throw new BlockedError("This user blocked you or you blocked him.");
			if (relation.status === "ACCEPTED")
				throw new AlreadyRelatedError("You are already friends.");

			if (Number(relation.requester_id as unknown) !== friendship.getRequesterId())
			{
				const	swapDto: friendshipsUpdateDto = new friendshipsUpdateDto(Number(relation.requester_id), friendship.getRequesterId());

				return await this.friendshipsRepo.acceptFriendRequest(swapDto);
			}

			throw new Error("You already sent a friend request.");
		}

		return await this.friendshipsRepo.addFriendRequest(friendship);
	}

	async acceptRequest(friendship: friendshipsUpdateDto): Promise<friendshipsRespDto> {
		const	relation: { status: string, requester_id: number | string} | null = await this.friendshipsRepo.getRelationStatus(friendship.getCheckTable());

		if (!relation)
			throw new NoRelationError("No relation yet with this user, try to send him a friend request.");

		if (relation.status !== 'PENDING')
		{
			if (relation.status === "BLOCKED")
				throw new BlockedError("This user blocked you or you blocked him.");
			if (relation.status === "ACCEPTED")
				throw new AlreadyRelatedError("You are already friends or a request is pending.");
		}

		return await this.friendshipsRepo.acceptFriendRequest(friendship);
	}

	async blockUser(friendship: friendshipsAddDto): Promise<friendshipsRespDto> {
		const	relation: { status: string, requester_id: number | string} | null = await this.friendshipsRepo.getRelationStatus(friendship.getCheckTable());

		if (relation && relation.status === "BLOCKED" && Number(relation.requester_id) !== friendship.getRequesterId())
			throw new BlockedError("This user already blocked you.");

		if (relation && relation.status === "BLOCKED" && Number(relation.requester_id) === friendship.getRequesterId())
			throw new BlockedError("You already block this user.");

		return await this.friendshipsRepo.blockUser(friendship);
	}

	async getRelationStatus(idA: number, idB: number): Promise<{ status: string }> {
		if (idA === idB)
			return { status: "SELF" };
		
		const	params: number[] = [idA, idB, idB, idA];
		
		const	relation: { status: string, requester_id: number | string} | null = await this.friendshipsRepo.getRelationStatus(params);
		
		if (!relation)
			return { status: "NONE" };
	
		return { status: relation.status };
	}
	
	async getFriendsList(userId: number): Promise<FriendUser[]> {
		return await this.friendshipsRepo.getFriendsList(userId);
	}
	
	async removeRelation(userId: number, targetId: number): Promise<void> {
		const	relation: { status: string, requester_id: number | string} | null = await this.friendshipsRepo.getRelationStatus([userId, targetId, targetId, userId]);

		if (!relation)
			throw new NoRelationError("No relation yet with this user.");

		return await this.friendshipsRepo.removeRelation(userId, targetId);
	}
	
	async unblockUser(userId: number, targetId: number): Promise<void> {
		const	relation: { status: string, requester_id: number | string} | null = await this.friendshipsRepo.getRelationStatus([userId, targetId, targetId, userId]);

		if (!relation)
			throw new NoRelationError("No relation yet with this user.");

		if (relation.status !== "BLOCKED" || Number(relation.requester_id) !== userId)
			throw new BlockedError("You are not blocking this user.");

		return await this.friendshipsRepo.removeRelation(userId, targetId);
	}
}
