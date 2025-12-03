/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:48:15 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 17:27:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL PONG REPOSITORIES FUNCTIONS


/* ====================== IMPORTS ====================== */

import { NotExistError }	from "../utils/throwErrors.js"
import { pongAddDto }		from "../dtos/pongAddDto.js"
import { pongRespDto }		from "../dtos/pongRespDto.js"
import { pongRepository }	from "../repositories/pongRepository.js"

import type { GameUser } from "../objects/gameUser.js"


/* ====================== CLASS ====================== */

export class	PongService {
	private	pongRepo: pongRepository;

	constructor(pongRepo: pongRepository) {
		this.pongRepo = pongRepo;
	}

	async addPongGame(pongAddDto: pongAddDto): Promise<pongRespDto> {
		const	id: number = await this.pongRepo.addPongGame(pongAddDto);
		return await this.getPongGameById(id);
	}

	async getPongGameById(gameId: number): Promise<pongRespDto> {
		const	query: string = "SELECT 1 FROM pong WHERE id = ? LIMIT 1";
		if (!(await this.pongRepo.isTaken(query, [gameId.toString()])))
			throw new NotExistError(`The pong game ${gameId} does not exist`);

		return await this.pongRepo.getPongGameById(gameId);
	}

	async getPongHistoryByClientId(userId: number): Promise<GameUser[]> {
		const	query: string = "SELECT 1 FROM pong WHERE id_client = ? LIMIT 1";
		if (!(await this.pongRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} hasn't play any games`);

		return await this.pongRepo.getPongHistoryByClientId(userId);
	}

	async deletePongGame(gameId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM pong WHERE id = ? LIMIT 1";
		if (!(await this.pongRepo.isTaken(query, [gameId.toString()])))
			throw new NotExistError(`The pong game ${gameId} does not exist`);

		return await this.pongRepo.deletePongGame(gameId);
	}

	async deleteClientPongGame(userId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM pong WHERE id_client = ? LIMIT 1";
		if (!(await this.pongRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`User ${userId} hasn't play any game.`);

		return await this.pongRepo.deletePongGame(userId);
	}
}
