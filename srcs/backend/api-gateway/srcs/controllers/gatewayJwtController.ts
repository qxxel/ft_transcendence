/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayJwtController.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:00:05 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 20:08:14 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/jwt`


/* ====================== IMPORT ====================== */

import axios	from 'axios';
import https	from 'https';

import { requestErrorsHandler }	from "../utils/requestErrors.js";

import type { FastifyInstance }	from 'fastify';


/* ====================== FUNCTION ====================== */

export async function	gatewayJwtController(gatewayFastify: FastifyInstance, options: { httpsAgent: https.Agent }) {
	const { httpsAgent } = options;

	gatewayFastify.post('/', async (request, reply) => {
		try {
			const response = await axios.post('https://jwt:3000',
				request.body,
				{ httpsAgent }
			);

			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/validate', async (request, reply) => {
		try {
			const response = await axios.get('https://jwt:3000/validate',
				{ httpsAgent, withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/refresh', async (request, reply) => {
		try {
			const response = await axios.post('https://jwt:3000/refresh',
				request.body,
				{ httpsAgent,withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

}
