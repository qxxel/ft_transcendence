/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewaytwofaController.ts                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 23:09:42 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:31:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE ALL REQUESTS THAT THE API GATEWAY RECEIVES FOR `/api/twofa` ENDPOINTS


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from "../api-gateway.js"
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewaytwofaController(gatewayFastify: FastifyInstance) {

	gatewayFastify.post('/otp', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'http://twofa:3000/otp',
				request.body,
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			return reply.send(response.data);
		} catch (error: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, error);
		}
	});

	gatewayFastify.post('/validate', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'http://twofa:3000/validate',
				request.body,
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			return reply.send(response.data);
		} catch (error: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, error);
		}
	});
}