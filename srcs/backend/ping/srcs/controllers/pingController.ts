/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pingController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 21:46:12 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT PING SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import { pingAxios, pingServ, pingFastify }	from "../ping.js"
import { errorsHandler }					from "../utils/errorsHandler.js"

import type	{ AxiosResponse }								from 'axios'
import type { FastifyInstance, FastifyRequest }				from 'fastify'
import type { FastifyReply }								from 'fastify'
import type { FriendshipIdsObject } from "../utils/friendObject.js"


/* ====================== FUNCTIONS ====================== */

async function	ping(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	payload: AxiosResponse = await pingAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		await pingServ.ping(payload.data.id);
		return reply.status(201).send(payload.data.id);
	} catch (err: unknown) {
		return await errorsHandler(pingFastify, reply , err);
	}
}

async function	deleteClient(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	{ id } = request.params as { id: number };

		await pingServ.deleteClient(id);

		await pingAxios.post('http://user:3000/log', { isLog: false }, { headers: { 'user-id': id } } );

		try {
			const	ids: FriendshipIdsObject[] = await pingAxios.get(`https://user:3000/friends/${id}`);
			ids.forEach(async (value: FriendshipIdsObject) => {
				const	targetId: string = parseInt(value.receiver_id, 10) === id ? value.requester_id : value.receiver_id;
				const	parseTargetId: number = parseInt(targetId, 10);

				const	notifBody: Object = { type: "SET_OFFLINE" };
				await pingAxios.post(`http://notif:3000/send/${parseTargetId}`, notifBody,
					{ headers: { 'user-id': id } }
				);
			});
		} catch (err: unknown) {
			console.error("Failed to send notification.");
		}

		return reply.status(204).send();
	} catch (err: unknown) {
		return await errorsHandler(pingFastify, reply , err);
	}
}

export function	pingController(pingFastify: FastifyInstance): void {
	pingFastify.post('/', ping);
	pingFastify.patch('/', ping);

	pingFastify.delete('/:id', deleteClient);
}
