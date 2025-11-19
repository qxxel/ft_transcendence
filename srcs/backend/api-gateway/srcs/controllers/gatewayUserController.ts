/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayUserController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/16 14:24:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 03:03:41 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/user`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from "../api-gateway.js";
import { requestErrorsHandler }	from "../utils/requestErrors.js";

import type { AxiosResponse }  									from 'axios';
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';


/* ====================== FUNCTION ====================== */

export async function	gatewayUserController(gatewayFastify: FastifyInstance): Promise<void> {
	gatewayFastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.get('https://user:3000/');

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	response: AxiosResponse = await gatewayAxios.get(`https://user:3000/${parseId}`);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.post('https://user:3000/', request.body);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	response: AxiosResponse = await gatewayAxios.delete(`https://user:3000/${parseId}`);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});
}
