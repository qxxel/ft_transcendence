/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:38:43 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/26 17:48:19 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR FRIENDSHIPS TABLE


/* ====================== IMPORTS ====================== */

import { errorsHandler }		from "../utils/errorsHandler.js"
import { extractUserId }		from "../utils/extractHeaders.js"
import { friendshipsAddDto }	from "../dtos/friendshipsAddDto.js"
import { friendshipsRespDto }	from "../dtos/friendshipsRespDto.js"
import { friendshipsServ } 		from "../user.js"
import { friendshipsUpdateDto }	from "../dtos/friendshipsUpdateDto.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import { MissingHeaderError } from "../utils/throwErrors.js"


/* ====================== FUNCTION ====================== */

export async function	friendshipsController(userFastify: FastifyInstance): Promise<void> {
	userFastify.post('/request', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	userId: number = extractUserId(request);

			const	friendship: friendshipsAddDto = new friendshipsAddDto(request.body, userId);

			return reply.code(201).send(await friendshipsServ.addFriendRequest(friendship));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.patch('/accept', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	friendship: friendshipsUpdateDto = new friendshipsUpdateDto(request.body);

			return reply.code(200).send(await friendshipsServ.acceptRequest(friendship));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.post('/block', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	userId: number = extractUserId(request);

			const	friendship: friendshipsAddDto = new friendshipsAddDto(request.body, userId);

			return reply.code(201).send(await friendshipsServ.blockUser(friendship));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			return reply.code(201).send(await friendshipsServ.getFriendsList(parseId));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.get('/:idA/:idB', async (request: FastifyRequest, reply: FastifyReply) => {
		const { idA, idB } = request.params as { idA: string, idB: string };
		const parseIdA = parseInt(idA, 10);
		const parseIdB = parseInt(idB, 10);
		if (isNaN(parseIdA) || isNaN(parseIdB))
			return reply.code(400).send({ error: "Invalid IDs provided." });

		try {
			return reply.code(201).send(await friendshipsServ.getRelationStatus(parseIdA, parseIdB));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.delete('/:idA/:idB', async (request: FastifyRequest, reply: FastifyReply) => {
		const { idA, idB } = request.params as { idA: string, idB: string };
		const parseIdA = parseInt(idA, 10);
		const parseIdB = parseInt(idB, 10);
		if (isNaN(parseIdA) || isNaN(parseIdB))
			return reply.code(400).send({ error: "Invalid IDs provided." });

		try {
			await friendshipsServ.removeRelation(parseIdA, parseIdB);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.delete('/unblock/:idA/:idB', async (request: FastifyRequest, reply: FastifyReply) => {
		const { idA, idB } = request.params as { idA: string, idB: string };
		const parseIdA = parseInt(idA, 10);
		const parseIdB = parseInt(idB, 10);
		if (isNaN(parseIdA) || isNaN(parseIdB))
			return reply.code(400).send({ error: "Invalid IDs provided." });

		try {
			await friendshipsServ.unblockUser(parseIdA, parseIdB);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});
}
