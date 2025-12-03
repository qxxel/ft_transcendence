/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:36:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 16:59:06 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT GAME SERVICE RECEIVE (WITH PONG GAME)


/* ====================== IMPORTS ====================== */

import { errorsHandler }	from "../utils/errorsHandler.js"
import { pongAddDto }		from "../dtos/pongAddDto.js"
import { pongRespDto }		from "../dtos/pongRespDto.js"
import { pongServ }			from "../game.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { GameUser }										from "../objects/gameUser.js"
import { extractUserId } from "../utils/extractHeaders.js"


/* ====================== FUNCTION ====================== */

export async function	pongController(gameFastify: FastifyInstance) {
	// ADD A GAME
	gameFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			gameFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	newPongGame: pongAddDto = new pongAddDto(request.body);
			const	pongGame: pongRespDto = await pongServ.addPongGame(newPongGame);

			return reply.code(201).send(pongGame);
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// GET A PONG GAME WITH HIS ID
	// gameFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
	// 	const	{ id } = request.params as { id: string };
	// 	const	parseId: number = parseInt(id, 10);

	// 	try {
	// 		const	pongGame: pongRespDto = await pongServ.getPongGameById(parseId);

	// 		return reply.code(200).send(pongGame);
	// 	}
	// 	catch (err: unknown) {
	// 		return errorsHandler(gameFastify, reply, err);
	// 	}
	// });

	// GET MY GAME HISTORY
	gameFastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: number = extractUserId(request);

			const	pongGame: GameUser[] = await pongServ.getPongHistoryByClientId(userId);

			return reply.code(200).send(pongGame);
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// GET GAME HISTORY BY ID
	gameFastify.get('/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId: number = parseInt(targetId, 10);

			const	pongGame: GameUser[] = await pongServ.getPongHistoryByClientId(parseTargetId);

			return reply.code(200).send(pongGame);
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// DELETE A PONG GAME WITH ITS ID
	gameFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			await pongServ.deletePongGame(parseId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});
}
