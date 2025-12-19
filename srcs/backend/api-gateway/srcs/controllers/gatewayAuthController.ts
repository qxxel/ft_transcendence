/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayAuthController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 19:50:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 12:48:51 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/auth`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from "../api-gateway.js"
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayAuthController(gatewayFastify: FastifyInstance) {
	gatewayFastify.post('/sign-up', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'http://auth:3000/sign-up',
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

	gatewayFastify.post('/sign-in', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'http://auth:3000/sign-in',
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

	gatewayFastify.post('/validateUser', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'http://auth:3000/validateUser',
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

	gatewayFastify.post('/delete/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post(
				'http://auth:3000/delete/me',
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

	gatewayFastify.patch('/updateUser', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.patch(
				'http://auth:3000/updateUser',
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

	gatewayFastify.post('/twofa/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.delete(
				'http://auth:3000/twofa/me',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			return reply.send(response.data);
		} catch (error: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, error);
		}
	});

	gatewayFastify.delete('/twofa/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.delete(
				'http://auth:3000/twofa/me',
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