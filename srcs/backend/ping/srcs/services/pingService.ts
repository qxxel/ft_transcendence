/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pingService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:50:23 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE PING REPOSITORY


/* ====================== IMPORT ====================== */

import { pingAxios }	 	from "../ping.js"
import { pingRepository }	from "../repositories/pingRepository.js"

import type { FriendshipIdsObject }	from "../utils/friendObject.js"

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

		try {
			const	ids: FriendshipIdsObject[] = (await pingAxios.get(`http://user:3000/friends/${idClient}`)).data;
			for (let i: number = 0; i < ids.length; i++)
			{
				const	value = ids[i];
				if (!value)
					continue ;

				const	targetId: string = parseInt(value.receiver_id, 10) === idClient ? value.requester_id : value.receiver_id;
				const	parseTargetId: number = parseInt(targetId, 10);

				const	notifBody: Object = { type: "SET_ONLINE" };
				await pingAxios.post(`http://notif:3000/send/${parseTargetId}`, notifBody,
					{ headers: { 'user-id': idClient } }
				);
			}
		} catch (error: unknown) {
			console.error("Failed to send notification.");
		}

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
