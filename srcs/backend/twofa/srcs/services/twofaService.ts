/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofaService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/12 20:09:52 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE AUTH REPOSITORY


/* ====================== IMPORT ====================== */

import { twofaRepository }	from "../repositories/twofaRepository.js"


/* ====================== class	====================== */

export class	twofaService {
	private	twofaRepo: twofaRepository;

	constructor(twofaRepo: twofaRepository) {
		this.twofaRepo = twofaRepo;
	}

	async addOtp(id: number, otpSecretKey: string): Promise<void> {
		return await this.twofaRepo.addOtp(id, otpSecretKey);
	}

	async getOtpSecretKeyByIdClient(id: number): Promise<string | null> {
		return await this.twofaRepo.getOtpSecretKeyByIdClient(id);
	}

	async deleteOtpByIdClient(id: number): Promise<void> {
		return await this.twofaRepo.deleteOtpByIdClient(id);
	}
}
