/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notifController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 19:53:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:49:22 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/jwt`


/* ====================== IMPORTS ====================== */

import { errorsHandler }	from "../utils/errorsHandler.js"
import { extractUserId }	from "../utils/extractHeaders.js"
import { notifManager }		from "../notif.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	notifController(notifFastify: FastifyInstance) {
	notifFastify.get('/sse', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: number = extractUserId(request);

			reply.raw.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': 'https://localhost:8080',
				'Access-Control-Allow-Credentials': 'true'
			});

			notifManager.addClient(userId, reply);

			reply.raw.write(`data: {"type": "CONNECTED"}\n\n`);

			await new Promise(() => {});
		} catch (error: unknown) {
			errorsHandler(notifFastify, reply, error);
		}
	});

	notifFastify.post('/send/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId: number = parseInt(targetId, 10);

			notifManager.sendToUser(parseTargetId, request.body);

			return reply.status(201).send();
		} catch (error: unknown) {
			errorsHandler(notifFastify, reply, error);
		}
	});
}