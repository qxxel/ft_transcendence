/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 22:30:19 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE AUTH REPOSITORY


/* ====================== IMPORT ====================== */

import { authRepository }	from "../repositories/authRepository.js"


/* ====================== CLASS ====================== */

export class	authService {
	private	authRepo;

	constructor(authRepo: authRepository) {
		this.authRepo = authRepo;
	}

	async addClient(id: string, password: string): Promise<void> {
		return await this.authRepo.addClient(id, password);
	}

	async getClient(id: string): Promise<string> {
		return await this.authRepo.getClient(id);
	}

	async deleteClient(id: string): Promise<void> {
		return await this.authRepo.deleteClient(id);
	}
}
