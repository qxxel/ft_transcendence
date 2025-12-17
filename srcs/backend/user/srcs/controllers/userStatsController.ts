/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsController.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:26:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 11:54:50 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR USER STATS TABLE


/* ====================== IMPORTS ====================== */

import { userStatsServ } 			from "../user.js"
import { errorsHandler }			from "../utils/errorsHandler.js"
import { userStatsRespDto }			from "../dtos/userStatsRespDto.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import { extractUserId } from "../utils/extractHeaders.js";


/* ====================== FUNCTION ====================== */

export async function	userStatsController(userFastify: FastifyInstance): Promise<void> {
	userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	userStats: userStatsRespDto = await userStatsServ.getStatsByUserId(parseId);

			return reply.code(200).send(userStats);
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: number = extractUserId(request);

			const	userStats: userStatsRespDto = await userStatsServ.getStatsByUserId(userId);

			return reply.code(200).send(userStats);
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {		//	AXEL: MAYBE /me
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	userStats: userStatsRespDto = await userStatsServ.updateStats(request.body, parseId);

			return reply.code(200).send(userStats);
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});
}
