/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notificationManager.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 20:17:55 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 15:06:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE MANAGER OF THE NOTIFICATION SYSTEM => THE LINK BETWEEN USERS AND SERVER


/* ====================== IMPORT ====================== */

import type { FastifyReply }	from 'fastify'


/* ====================== IMPORTS ====================== */

export class	NotificationManager {
	private	clients: Map<number, FastifyReply>;

	constructor() {
		this.clients = new Map<number, FastifyReply>();
	}

	public	addClient(userId: number, reply: FastifyReply): void {
		this.clients.set(userId, reply);
		console.log(`User ${userId} connected to notifications`);

		reply.raw.on('close', () => {
			if (this.clients.get(userId) === reply)
				this.removeClient(userId);
		});
	}

	private	removeClient(userId: number): void {
		if (this.clients.has(userId))
		{
			this.clients.delete(userId);
			console.log(`User ${userId} disconnected from notifications`);
		}
	}

	public	sendToUser(targetId: number, data: any): void {
		const	client = this.clients.get(targetId);
		if (client)
			client.raw.write(`data: ${JSON.stringify(data)}\n\n`);
	}
}
