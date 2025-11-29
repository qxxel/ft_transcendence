/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayGameController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:05:35 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/29 11:32:51 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/game`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from '../api-gateway.js'
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayGameController(gatewayFastify: FastifyInstance) {
	gatewayFastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.get(
				'https://game:3000/',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/pong', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('https://game:3000/pong', request.body);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/tank', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('https://game:3000/tank', request.body);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});
}
