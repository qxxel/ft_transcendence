/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayNotifController.ts                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 20:15:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 10:09:36 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/notification`


/* ====================== IMPORTS ====================== */

import { getValidUserId }		from "../utils/validateJwt.js"
import { notifManager }			from "../api-gateway.js"
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosHeaderValue }								from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayNotifController(gatewayFastify: FastifyInstance) {
	gatewayFastify.get('/sse', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userIdStr: AxiosHeaderValue = await getValidUserId(request);
			const	userId: number = parseInt(userIdStr as string, 10);

			reply.raw.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': 'https://localhost:8080',
				'Access-Control-Allow-Credentials': 'true'
			});

			notifManager.addClient(userId, reply);

			reply.raw.write(`data: {"type": "CONNECTED"}\n\n`);			//	AXEL: MAYBE REMOVE

			await new Promise(() => {});
		} catch (err: unknown) {
			requestErrorsHandler(gatewayFastify, reply, err);
		}
	});
}
