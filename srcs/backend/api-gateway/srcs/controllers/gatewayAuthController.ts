/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayAuthController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 19:50:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/18 00:58:19 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/auth`


/* ====================== IMPORT ====================== */

import axios	from 'axios';
import https	from 'https';

import { requestErrorsHandler }	from "../utils/requestErrors.js";

import type { FastifyInstance }	from 'fastify';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

/* ====================== FUNCTION ====================== */

export async function	gatewayAuthController(gatewayFastify: FastifyInstance) {

	gatewayFastify.post('/sign-up', async (request, reply) => {
		try {
			const response = await axios.post(
				'https://auth:3000/sign-up',
				request.body,
				{ httpsAgent, withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);
			
			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/sign-in', async (request, reply) => {
		try {
			const response = await axios.post(
				'https://auth:3000/sign-in',
				request.body,
				{ httpsAgent, withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
					reply.header('Set-Cookie', response.headers['set-cookie']);

			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/logout', async (request, reply) => {
		try {
			const response = await axios.delete(
				'https://auth:3000/logout',
				{ httpsAgent, withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/me', async (request, reply) => {
		try {
			const response = await axios.delete(
				'https://auth:3000/me',
				{ httpsAgent, withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
					reply.header('Set-Cookie', response.headers['set-cookie']);

			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

}