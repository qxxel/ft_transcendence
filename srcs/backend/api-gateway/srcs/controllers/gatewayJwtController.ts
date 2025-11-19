/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayJwtController.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:00:05 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 03:04:40 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/jwt`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from "../api-gateway.js";
import { requestErrorsHandler }	from "../utils/requestErrors.js";

import type { AxiosResponse }										from 'axios';
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';


/* ====================== FUNCTION ====================== */

export async function	gatewayJwtController(gatewayFastify: FastifyInstance) {
	gatewayFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('https://jwt:3000',
				request.body
			);

			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/validate', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.get('https://jwt:3000/validate',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/validate', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.get('https://jwt:3000/validate',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('https://jwt:3000/refresh',
				request.body,
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/refresh/logout', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.delete('https://jwt:3000/refresh/logout',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.delete('https://jwt:3000/:id',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

}
