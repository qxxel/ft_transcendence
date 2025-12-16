/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:38:43 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:01:03 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR FRIENDSHIPS TABLE


/* ====================== IMPORTS ====================== */

import { friendshipsServ } 		from "../user.js"
import { errorsHandler }		from "../utils/errorsHandler.js"
import { extractUserId }		from "../utils/extractHeaders.js"
import { friendshipsAddDto }	from "../dtos/friendshipsAddDto.js"
import { friendshipsUpdateDto }	from "../dtos/friendshipsUpdateDto.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	friendshipsController(userFastify: FastifyInstance): Promise<void> {
	// FRIENDS RELATION MANAGEMENT
	userFastify.post('/request/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId = parseInt(targetId, 10);

			const	userId: number = extractUserId(request);

			const	friendship: friendshipsAddDto = new friendshipsAddDto(userId, parseTargetId);

			return reply.code(201).send(await friendshipsServ.addFriendRequest(friendship));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.post('/:idA/:idB', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	{ idA, idB } = request.params as { idA: string, idB: string };
			const	parseIdA = parseInt(idA, 10);
			const	parseIdB = parseInt(idB, 10);
			if (isNaN(parseIdA) || isNaN(parseIdB))
				return reply.code(400).send({ error: "Invalid IDs provided." });						//	AXEL: A ENLEVER

			const	friendship: friendshipsAddDto = new friendshipsAddDto(parseIdA, parseIdB);

			return reply.code(201).send(await friendshipsServ.addFriend(friendship));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});
	
	userFastify.patch('/accept/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
	if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}
		
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId = parseInt(targetId, 10);

			const	userId: number = extractUserId(request);

			const	friendship: friendshipsUpdateDto = new friendshipsUpdateDto(userId, parseTargetId);
			
			return reply.code(200).send(await friendshipsServ.acceptRequest(friendship));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});
		
	userFastify.delete('/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId = parseInt(targetId, 10);
			if (isNaN(parseTargetId))
				return reply.code(400).send({ error: "Invalid IDs provided." });

			const	userId: number = extractUserId(request);

			await friendshipsServ.removeRelation(userId, parseTargetId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// RELATION GETTERS
	userFastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {			
		try {
			const	userId: number = extractUserId(request);
			return reply.code(201).send(await friendshipsServ.getFriendsList(userId));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {			
		try {
			const	{ id } = request.params as { id: string };
			const	parseId: number = parseInt(id, 10);

			return reply.code(201).send(await friendshipsServ.getFriendsList(parseId));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.get('/:idA/:idB', async (request: FastifyRequest, reply: FastifyReply) => {		
		try {
			const	{ idA, idB } = request.params as { idA: string, idB: string };
			const	parseIdA = parseInt(idA, 10);
			const	parseIdB = parseInt(idB, 10);
			if (isNaN(parseIdA) || isNaN(parseIdB))
				return reply.code(400).send({ error: "Invalid IDs provided." });

			return reply.code(201).send(await friendshipsServ.getRelationStatus(parseIdA, parseIdB));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	// BLOCK ROUTES
	userFastify.post('/block/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId = parseInt(targetId, 10);

			const	userId: number = extractUserId(request);

			const	friendship: friendshipsAddDto = new friendshipsAddDto(userId, parseTargetId);

			return reply.code(201).send(await friendshipsServ.blockUser(friendship));
		} catch (err: unknown) {
			errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.delete('/unblock/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId = parseInt(targetId, 10);

			const	userId: number = extractUserId(request);

			await friendshipsServ.unblockUser(userId, parseTargetId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});
}
