/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:48:15 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/01 00:50:51 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL PONG REPOSITORIES FUNCTIONS


/* ====================== IMPORTS ====================== */

import { NotExistError }	from "../utils/throwErrors.js"
import { pongAddDto }		from "../dtos/pongAddDto.js"
import { pongRespDto }		from "../dtos/pongRespDto.js"
import { pongRepository }	from "../repositories/pongRepository.js"


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

	async deletePongGame(gameId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM pong WHERE id = ? LIMIT 1";
		if (!(await this.pongRepo.isTaken(query, [gameId.toString()])))
			throw new NotExistError(`The pong game ${gameId} does not exist`);

		return await this.pongRepo.deletePongGame(gameId);
	}
}
