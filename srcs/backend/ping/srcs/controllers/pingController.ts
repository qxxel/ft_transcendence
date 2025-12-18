/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pingController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 06:21:11 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT PING SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import { pingAxios, pingServ, pingFastify }	from "../ping.js"
import { errorsHandler }					from "../utils/errorsHandler.js"

import type	{ AxiosResponse }								from 'axios'
import type { FastifyInstance, FastifyRequest }				from 'fastify'
import type { FastifyReply }								from 'fastify'


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
		
		return reply.status(204).send(id);
	} catch (err: unknown) {
		return await errorsHandler(pingFastify, reply , err);
	}
}

export async function	pingController(pingFastify: FastifyInstance): Promise<void> {
	pingFastify.post('/', ping);
	pingFastify.patch('/', ping);

	pingFastify.delete('/:id', deleteClient);
}
