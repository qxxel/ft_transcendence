/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewaytwofaController.ts                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 23:09:42 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:41:03 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
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
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});
}