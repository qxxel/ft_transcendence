/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsService.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:23:04 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:53:59 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL USER STATS REPOSITORY FUNCTIONS


/* ====================== IMPORTS ====================== */

import { GameNotFoundError }		from "../utils/throwErrors.js"
import { NotExistError }			from "../utils/throwErrors.js"
import { userStatsRespDto }			from "../dtos/userStatsRespDto.js"
import { userStatsPongUpdateDto }	from "../dtos/userStatsUpdateDto.js"
import { userStatsTankUpdateDto }	from "../dtos/userStatsUpdateDto.js"
import { userStatsRepository }		from "../repositories/userStatsRepository.js"


/* ====================== CLASS ====================== */

export class	userStatsService {
	private	userStatsRepo: userStatsRepository;

	constructor(userStatsRepo: userStatsRepository) {
		this.userStatsRepo = userStatsRepo;
	}

	async updateStats(body: any, userId: number): Promise<userStatsRespDto> {
		const	query: string = "SELECT 1 FROM user_stats WHERE user_id = ? LIMIT 1";
		if (!(await this.userStatsRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		let	userStatsUpdate: userStatsPongUpdateDto | userStatsTankUpdateDto;

		if (body.gameType && body.gameType === "pong")
		{
			userStatsUpdate = new userStatsPongUpdateDto(body, userId);
			return await this.userStatsRepo.updatePongStats(userStatsUpdate);
		}

		if (body.gameType && body.gameType === "tank")
		{
			userStatsUpdate = new userStatsTankUpdateDto(body, userId);

			return await this.userStatsRepo.updateTankStats(userStatsUpdate);
		}

		else
			throw new GameNotFoundError("Game not found, try pong or tank");
	}
			
	async getStatsByUserId(userId: number): Promise<userStatsRespDto> {
		const	query: string = "SELECT 1 FROM user_stats WHERE user_id = ? LIMIT 1";
		if (!(await this.userStatsRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		return await this.userStatsRepo.getStatsByUserId(userId);
	}
}
