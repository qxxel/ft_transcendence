/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pingService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 06:26:42 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE PING REPOSITORY


/* ====================== IMPORT ====================== */

import { pingRepository }	from "../repositories/pingRepository.js"
import { pingAxios }	 	from "../ping.js"

/* ====================== CLASS ====================== */

export class	pingService {
	private	pingRepo: pingRepository;

	constructor(pingRepo: pingRepository) {
		this.pingRepo = pingRepo;
	}

	async logoutInactiveClient(): Promise<void> {
		const	InactiveClients: number[] = await this.getInactiveClient();

		for (const client of InactiveClients) {
			try {
				await pingAxios.delete(`http://ping:3000/${client}`);
			} catch (error: unknown) {
				console.error(error);
			}
		}
	}

	async ping(idClient: number): Promise<void> {
		if (await this.getLastSeenByIdClient(idClient))
			return await this.updatePing(idClient)
		await pingAxios.post('http://user:3000/log', { isLog: true }, { headers: { 'user-id': idClient } } );
		return await this.addPing(idClient);
	}

	async addPing(idClient: number): Promise<void> {
		return await this.pingRepo.addPing(idClient);
	}

	async getLastSeenByIdClient(idClient: number): Promise<number | null> {
		return await this.pingRepo.getLastSeenByIdClient(idClient);
	}

	async getInactiveClient(): Promise<number[]> {
		return await this.pingRepo.getInactiveClient();
	}

	async updatePing(idClient: number): Promise<void> {
		return await this.pingRepo.updatePing(idClient);
	}

	async deleteClient(idClient: number): Promise<void> {
		return await this.pingRepo.deleteClient(idClient);
	}
}
