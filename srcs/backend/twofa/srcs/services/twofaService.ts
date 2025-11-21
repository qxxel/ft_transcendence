/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofaService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/20 22:40:32 by mreynaud         ###   ########.fr       */
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

	async addOtp(id: string, otpSecretKey: string, otp: string): Promise<void> {
		return await this.twofaRepo.addOtp(id, otpSecretKey, otp);
	}

	async getOtpByIdClient(id: string): Promise<string> {
		return await this.twofaRepo.getOtpByIdClient(id);
	}

	async getOtpSecretKeyByIdClient(id: string): Promise<string> {
		return await this.twofaRepo.getOtpSecretKeyByIdClient(id);
	}

	async deleteOtpByIdClient(id: string): Promise<void> {
		return await this.twofaRepo.deleteOtpByIdClient(id);
	}
}
