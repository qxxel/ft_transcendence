/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notifController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 19:53:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 21:05:29 by agerbaud         ###   ########.fr       */
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
		} catch (err: unknown) {
			errorsHandler(notifFastify, reply, err);
		}
	});

	notifFastify.post('/send/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId: number = parseInt(targetId, 10);

			notifManager.sendToUser(parseTargetId, request.body);

			return reply.status(201).send();
		} catch (err: unknown) {
			errorsHandler(notifFastify, reply, err);
		}
	});
}