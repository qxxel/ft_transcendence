/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 05:36:41 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE AUTH REPOSITORY


/* ====================== IMPORT ====================== */

import { authRepository }	from "../repositories/authRepository.js"
import { authAxios }	 	from "../auth.js"

/* ====================== FUNCTION ====================== */

async function deleteClient(authServ: authService, id: number) {
	try {
		await authAxios.delete(`http://game:3000/user/${id}`);
		await authAxios.delete(`http://user:3000/${id}`);
		await authAxios.delete(`http://twofa:3000/${id}`);
		await authServ.deleteClient(id);
	} catch (error: unknown) {
		console.error(error);
	}
}

/* ====================== CLASS ====================== */

export class	authService {
	private	authRepo: authRepository;

	constructor(authRepo: authRepository) {
		this.authRepo = authRepo;
	}

	async cleanup(): Promise<void> {
		const	expiredClients: number[] = await this.getExpiredClients();

		for (const client of expiredClients) {
			const	date: number | null = await this.getExpiresByIdClient(client);

			if (date === null)
				continue;

			const	delay: number = date - Date.now();

			if (delay <= 0)
				deleteClient(this, client);
		}
	}

	async addClient(id: number, password: string): Promise<void> {
		return await this.authRepo.addClient(id, password);
	}

	async getPasswordByIdClient(id: number): Promise<string | null> {
		return await this.authRepo.getPasswordByIdClient(id);
	}

	async getExpiredClients(): Promise<number[]> {
		return await this.authRepo.getExpiredClients();
	}

	async getExpiresByIdClient(id: number): Promise<number | null> {
		return await this.authRepo.getExpiresByIdClient(id);
	}

	async updateExpiresByIdClient(userId: number, expires_at: string | null): Promise<void> {
		return await this.authRepo.updateExpiresByIdClient(userId, expires_at);
	}

	async deleteClient(id: number): Promise<void> {
		return await this.authRepo.deleteClient(id);
	}
}
