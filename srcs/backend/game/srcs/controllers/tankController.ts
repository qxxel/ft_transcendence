/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tankController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:36:26 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 21:53:09 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT GAME SERVICE RECEIVE (WITH TANK GAME)


/* ====================== IMPORTS ====================== */

import { errorsHandler }	from "../utils/errorsHandler.js"
import { tankAddDto }		from "../dtos/tankAddDto.js"
import { tankRespDto }		from "../dtos/tankRespDto.js"
import { tankServ }			from "../game.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	tankController(gameFastify: FastifyInstance) {
	// GET A TANK GAME WITH HIS ID
	gameFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	tankGame: tankRespDto = await tankServ.getTankGameById(parseId);

			return reply.code(200).send(tankGame);
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// ADD A GAME
	gameFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			gameFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	newTankGame: tankAddDto = new tankAddDto(request.body);
			const	tankGame: tankRespDto = await tankServ.addTankGame(newTankGame);

			return reply.code(201).send(tankGame);
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// DELETE A TANK GAME WITH ITS ID
	gameFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			await tankServ.deleteTankGame(parseId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});
}
