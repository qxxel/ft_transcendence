/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tankService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 21:45:55 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 21:50:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL TANK REPOSITORIES FUNCTIONS


/* ====================== IMPORTS ====================== */

import { NotExistError }	from "../utils/throwErrors.js"
import { tankAddDto }		from "../dtos/tankAddDto.js"
import { tankRespDto }		from "../dtos/tankRespDto.js"
import { tankRepository }	from "../repositories/tankRepository.js"


/* ====================== CLASS ====================== */

export class	tankService {
	private	tankRepo: tankRepository;

	constructor(tankRepo: tankRepository) {
		this.tankRepo = tankRepo;
	}

	async addTankGame(tankAddDto: tankAddDto): Promise<tankRespDto> {
		const	id: number = await this.tankRepo.addTankGame(tankAddDto);
		return await this.getTankGameById(id);
	}

	async getTankGameById(gameId: number): Promise<tankRespDto> {
		const	query: string = "SELECT 1 FROM tank WHERE id = ? LIMIT 1";
		if (!(await this.tankRepo.isTaken(query, [gameId.toString()])))
			throw new NotExistError(`The tank game ${gameId} does not exist`);

		return await this.tankRepo.getTankGameById(gameId);
	}

	async deleteTankGame(gameId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM tank WHERE id = ? LIMIT 1";
		if (!(await this.tankRepo.isTaken(query, [gameId.toString()])))
			throw new NotExistError(`The tank game ${gameId} does not exist`);

		return await this.tankRepo.deleteTankGame(gameId);
	}
}
