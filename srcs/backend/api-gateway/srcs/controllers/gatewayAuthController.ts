/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayAuthController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 19:50:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/01 15:32:17 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/auth`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from '../api-gateway.js'
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayAuthController(gatewayFastify: FastifyInstance) {
	gatewayFastify.post('/sign-up', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'https://auth:3000/sign-up',
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

	gatewayFastify.post('/sign-in', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'https://auth:3000/sign-in',
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

	gatewayFastify.post('/validateUser', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'https://auth:3000/validateUser',
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

	gatewayFastify.delete('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.delete(
				'https://auth:3000/me',
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