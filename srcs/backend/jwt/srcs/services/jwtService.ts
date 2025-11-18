/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtService.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:47 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 23:35:52 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE JWT REPOSITORY


/* ====================== IMPORT ====================== */

import type { jwtRespDto } from "../dtos/jwtRespDto.js";
import { jwtRepository }	from "../repositories/jwtRepository.js"


/* ====================== CLASS ====================== */

export class	jwtService {
	private	jwtRepo;

	constructor(jwtRepo: jwtRepository) {
		this.jwtRepo = jwtRepo;
	}

	async addToken(token: string, clientId: number): Promise<number> {
		return await this.jwtRepo.addToken(token, clientId);
	}

	async getClientIdByToken(token: string): Promise<jwtRespDto> {
		return await this.jwtRepo.getClientIdByToken(token);
	}

	async isValidToken(token: string): Promise<boolean> {
		return await this.jwtRepo.isValidToken(token);
	}

	async deleteToken(token: string): Promise<void> {
		return await this.jwtRepo.deleteToken(token);
	}

	async deleteTokenById(id: number): Promise<void> {
		return await this.jwtRepo.deleteTokenById(id);
	}
}
