/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE AUTH REPOSITORY


/* ====================== IMPORT ====================== */

import { authRepository }	from "../repositories/authRepository.js"


/* ====================== CLASS ====================== */

export class	authService {
	private	authRepo: authRepository;

	constructor(authRepo: authRepository) {
		this.authRepo = authRepo;
	}

	async addClient(id: string, password: string): Promise<void> {
		return await this.authRepo.addClient(id, password);
	}

	async getPasswordByIdClient(id: string): Promise<string> {
		return await this.authRepo.getPasswordByIdClient(id);
	}

	async deleteClient(id: string): Promise<void> {
		return await this.authRepo.deleteClient(id);
	}
}
