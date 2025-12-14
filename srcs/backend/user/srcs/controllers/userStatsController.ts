/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsController.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:26:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 01:53:31 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR USER STATS TABLE


/* ====================== IMPORTS ====================== */

import { errorsHandler }			from "../utils/errorsHandler.js"
import { userStatsRespDto }			from "../dtos/userStatsRespDto.js"
import { userStatsServ } 			from "../user.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


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

	userFastify.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
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
