/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/16 14:24:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 17:08:40 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE


/* ====================== IMPORT ====================== */

import axios	from 'axios';
import https	from 'https';

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';

import { requestErrorsHandler }	from "../utils/requestErrors.js";


/* ====================== FUNCTIONS ====================== */

export async function	gatewayController(gatewayFastify: FastifyInstance, options: { httpsAgent: https.Agent }) {
	const { httpsAgent } = options;

	gatewayFastify.get('/', async (request, reply) => {
		try {
			const response = await axios.get('https://user:3000/', { httpsAgent });

			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/:id', async (request, reply) => {
		const { id } = request.params as { id: string };
		const parseId = parseInt(id, 10);

		try {
			const response = await axios.get(`https://user:3000/${parseId}`, { httpsAgent });

			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/', async (request, reply) => {
		try {
			const response = await axios.post('https://user:3000/', request.body, { httpsAgent });

			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/:id', async (request, reply) => {
		const { id } = request.params as { id: string };
		const parseId = parseInt(id, 10);

		try {
			const response = await axios.delete(`https://user:3000/${parseId}`, { httpsAgent });

			return reply.send(response.data);
		} catch (err) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

}
