/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/01 14:24:37 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE AUTH REPOSITORY


/* ====================== IMPORT ====================== */

import { authRepository }	from "../repositories/authRepository.js"
import { authAxios } 	from "../auth.js"

import type	{ AxiosResponse }	from 'axios'

/* ====================== FUNCTION ====================== */

function runInMinutes(fn: () => void, minutes: number) {
	setTimeout(fn, minutes * 60 * 1000);
}

async function deleteClientIfExpires(authServ: authService, id: number) {
	const expires_at: string | undefined = await authServ.getExpiresByIdClient(id)
	if (expires_at !== "null" && expires_at !== undefined) {
		await authAxios.delete(`https://user:3000/${id}`);
		await authAxios.delete(`https://twofa:3000/${id}`);
		await authServ.deleteClient(id);
	}
}

/* ====================== CLASS ====================== */

export class	authService {
	private	authRepo: authRepository;

	constructor(authRepo: authRepository) {
		this.authRepo = authRepo;
	}

	async addClient(id: number, password: string): Promise<void> {
		runInMinutes(() => deleteClientIfExpires(this, id), 5);
		return await this.authRepo.addClient(id, password);
	}

	async getPasswordByIdClient(id: number): Promise<string> {
		return await this.authRepo.getPasswordByIdClient(id);
	}

	async getExpiresByIdClient(id: number): Promise<string | undefined> {
		return await this.authRepo.getExpiresByIdClient(id);
	}

	async updateExpiresByIdClient(userId: number, expires_at: string): Promise<void> {
		return await this.authRepo.updateExpiresByIdClient(userId, expires_at);
	}

	async deleteClient(id: number): Promise<void> {
		return await this.authRepo.deleteClient(id);
	}
}
