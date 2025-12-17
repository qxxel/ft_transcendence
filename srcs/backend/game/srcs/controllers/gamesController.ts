/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:36:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 09:52:13 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT GAME SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import { gamesServ }			from "../game.js"
import { gamesAddDto }			from "../dtos/gamesAddDto.js"
import { gamesRespDto }			from "../dtos/gamesRespDto.js"
import { errorsHandler }		from "../utils/errorsHandler.js"
import { extractUserId }		from "../utils/extractHeaders.js"

import type { FastifyInstance, FastifyRequest }		from 'fastify'
import type { FastifyReply }						from 'fastify'
import type { GameUser }							from "../objects/gameUser.js"


/* ====================== FUNCTION ====================== */

export async function	gamesController(gameFastify: FastifyInstance) {
	// ADD A GAME
	gameFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			gameFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	userId: number = extractUserId(request);

			const	newGame: gamesAddDto = new gamesAddDto(request.body, userId);
			const	game: gamesRespDto = await gamesServ.addGame(newGame);

			return reply.code(201).send(game);
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// GET MY GAME HISTORY
	gameFastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: number = extractUserId(request);

			const	game: GameUser[] = await gamesServ.getHistoryByClientId(userId);

			return reply.code(200).send(game);
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

			const	game: GameUser[] = await gamesServ.getHistoryByClientId(parseTargetId);

			return reply.code(200).send(game);
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// DELETE A GAME WITH ITS ID
	gameFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			await gamesServ.deleteGame(parseId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});

	// DELETE GAMES WITH CLIENT ID
	gameFastify.delete('/user/:targetd', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetd } = request.params as { targetd: string };
			const	parseTargetd: number = parseInt(targetd, 10);

			await gamesServ.deleteClientGames(parseTargetd);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(gameFastify, reply, err);
		}
	});
}
