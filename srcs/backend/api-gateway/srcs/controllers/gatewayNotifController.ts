/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayNotifController.ts                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 20:15:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:48:03 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/notification`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from "../api-gateway.js"
import { getValidUserId }		from "../utils/validateJwt.js"
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosHeaderValue }								from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayNotifController(gatewayFastify: FastifyInstance) {
	gatewayFastify.get('/sse', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userIdStr: AxiosHeaderValue = await getValidUserId(request);
			const	userId: number = parseInt(userIdStr as string, 10);

			const	response: any = await gatewayAxios.get('http://notif:3000/sse',
				{ headers: { 'user-id': userId }, responseType: 'stream', timeout: 0 }
			);
			
			reply.raw.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': 'https://localhost:8080',
				'Access-Control-Allow-Credentials': 'true'
			});
			
			response.data.pipe(reply.raw);

			await new Promise((resolve) => {
				response.data.on('end', resolve);
				reply.raw.on('close', () => {
					response.request.destroy(); 
					resolve(null);
				});
			});
		} catch (error: unknown) {
			requestErrorsHandler(gatewayFastify, reply, error);
		}
	})
}
