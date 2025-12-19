/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayPingController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:00:05 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:31:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/ping`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from "../api-gateway.js"
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayPingController(gatewayFastify: FastifyInstance) {
	
	gatewayFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('http://ping:3000',
				request.body,
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			return reply.send(response.data);
		} catch (error: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, error);
		}
	});

	gatewayFastify.patch('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.patch('http://ping:3000',
				request.body,
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			return reply.send(response.data);
		} catch (error: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, error);
		}
	});

}
