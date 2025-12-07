/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:48:15 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/07 14:56:17 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL GAMES REPOSITORIES FUNCTIONS


/* ====================== IMPORTS ====================== */

import { NotExistError }	from "../utils/throwErrors.js"
import { gamesAddDto }		from "../dtos/gamesAddDto.js"
import { gamesRespDto }		from "../dtos/gamesRespDto.js"
import { gamesRepository }	from "../repositories/gamesRepository.js"

import type { GameUser } from "../objects/gameUser.js"


/* ====================== CLASS ====================== */

export class	GamesService {
	private	gamesRepo: gamesRepository;

	constructor(gamesRepo: gamesRepository) {
		this.gamesRepo = gamesRepo;
	}

	async addGame(gameAddDto: gamesAddDto): Promise<gamesRespDto> {
		const	id: number = await this.gamesRepo.addGame(gameAddDto);
		return await this.getGameById(id);
	}

	async getGameById(gameId: number): Promise<gamesRespDto> {
		const	query: string = "SELECT 1 FROM games WHERE id = ? LIMIT 1";
		if (!(await this.gamesRepo.isTaken(query, [gameId.toString()])))
			throw new NotExistError(`The game ${gameId} does not exist`);

		return await this.gamesRepo.getGameById(gameId);
	}

	async getHistoryByClientId(userId: number): Promise<GameUser[]> {
		return await this.gamesRepo.getHistoryByClientId(userId);
	}

	async deleteGame(gameId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM games WHERE id = ? LIMIT 1";
		if (!(await this.gamesRepo.isTaken(query, [gameId.toString()])))
			return ;	//	AXEL verify si j'ai bien fait

		return await this.gamesRepo.deleteGame(gameId);
	}

	async deleteClientGames(userId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM games WHERE id_client = ? LIMIT 1";
		if (!(await this.gamesRepo.isTaken(query, [userId.toString()])))
			return ;	//	AXEL verify si j'ai pas tout casser

		return await this.gamesRepo.deleteClientGames(userId);
	}
}
