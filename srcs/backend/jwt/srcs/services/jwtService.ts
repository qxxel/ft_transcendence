/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtService.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:47 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 18:37:54 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE JWT REPOSITORY


/* ====================== IMPORT ====================== */

import { jwtRepository }	from "../repositories/jwtRepository.js"


/* ====================== CLASS ====================== */

export class	jwtService {
	private	jwtRepo: jwtRepository;

	constructor(jwtRepo: jwtRepository) {
		this.jwtRepo = jwtRepo;
	}

	async cleanup(): Promise<void> {
		return await this.jwtRepo.cleanup();
	}

	async addToken(token: string, clientId: number): Promise<number> {
		return await this.jwtRepo.addToken(token, clientId);
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
