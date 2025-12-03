/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayGameController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:05:35 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 23:48:17 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/game`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from '../api-gateway.js'
import { getValidUserId }		from '../utils/validateJwt.js'
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosHeaderValue, AxiosResponse }					from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayGameController(gatewayFastify: FastifyInstance) {
	gatewayFastify.post('/pong', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('http://game:3000/pong', request.body);
			
			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/tank', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('http://game:3000/tank', request.body);
			
			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.get(
				'http://game:3000/',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/pong/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: AxiosHeaderValue = await getValidUserId(request);
		
			const	response: AxiosResponse = await gatewayAxios.get('http://game:3000/pong/me',
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/pong/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId: number = parseInt(targetId, 10);

			const	response: AxiosResponse = await gatewayAxios.get(`http://game:3000/pong/${parseTargetId}`,
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});
}
