/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/01 19:11:55 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE AUTH REPOSITORY


/* ====================== IMPORT ====================== */

import { authRepository }	from "../repositories/authRepository.js"
import { authAxios } 	from "../auth.js"

import type	{ AxiosResponse }	from 'axios'

/* ====================== FUNCTION ====================== */

function runIn(fn: () => void, m: number, s: number, ms: number) {
	setTimeout(fn, m * 60 * 1000 + s * 1000 + ms);
}

async function deleteClient(authServ: authService, id: number) {
	let maxAttempts: number = 0;

	while (maxAttempts < 5) {
		try {
			await authAxios.delete(`https://user:3000/${id}`);
			await authAxios.delete(`https://twofa:3000/${id}`);
			await authServ.deleteClient(id);
			
			break;
		} catch (error) {
			await new Promise(res => setTimeout(res, 1000));

			maxAttempts++;

			if (maxAttempts >= 5)
				throw new Error(`Unable to delete client ${id}`);
		}
	}
}

async function deleteClientIfExpires(authServ: authService, id: number) {
	const expires_at = await authServ.getExpiresByIdClient(id)
	if (expires_at !== null && expires_at !== undefined)
		deleteClient(authServ, id);
}

/* ====================== CLASS ====================== */

export class	authService {
	private	authRepo: authRepository;

	constructor(authRepo: authRepository) {
		this.authRepo = authRepo;
	}

	async cleanup(): Promise<void> {
		const expiredClients = await this.getExpiredClients();

		for (const client of expiredClients) {
			const date = await this.getExpiresByIdClient(client);

			if (date === undefined || date === null)
				continue;

			const	delay = date - Date.now();

			if (delay <= 0)
				deleteClient(this, client);
			else
				runIn(() => deleteClientIfExpires(this, client), 0, 0, delay);
		}
	}

	async addClient(id: number, password: string): Promise<void> {
		runIn(() => deleteClientIfExpires(this, id), 5, 0, 0);
		return await this.authRepo.addClient(id, password);
	}

	async getPasswordByIdClient(id: number): Promise<string> {
		return await this.authRepo.getPasswordByIdClient(id);
	}

	async getExpiredClients(): Promise<number[]> {
		return await this.authRepo.getExpiredClients();
	}

	async getExpiresByIdClient(id: number): Promise<number | undefined | null> {
		return await this.authRepo.getExpiresByIdClient(id);
	}

	async updateExpiresByIdClient(userId: number, expires_at: string | null): Promise<void> {
		return await this.authRepo.updateExpiresByIdClient(userId, expires_at);
	}

	async deleteClient(id: number): Promise<void> {
		return await this.authRepo.deleteClient(id);
	}
}
