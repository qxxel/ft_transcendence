/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:40:16 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/07 22:56:01 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR USERS TABLE


/* ====================== IMPORTS ====================== */

import { errorsHandler }	from "../utils/errorsHandler.js"
import { extractUserId }	from "../utils/extractHeaders.js"
import { usersAddDto }		from "../dtos/usersAddDto.js"
import { usersRespDto }		from "../dtos/usersRespDto.js"
import { usersUpdateDto }	from "../dtos/usersUpdateDto.js"
import { usersServ, userStatsServ } 		from "../user.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


interface	userUpdate {
	username?: string;
	email?: string;
	avatar?: string;
	is2faEnable?: boolean;
}

/* ====================== FUNCTION ====================== */

export async function	usersController(userFastify: FastifyInstance): Promise<void> {
	// GET A USER WITH HIS ID
	userFastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: number = extractUserId(request);

			const	user: usersRespDto = await usersServ.getUserById(userId);

			return reply.code(200).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);
		
		try {
			const	user: usersRespDto = await usersServ.getUserById(parseId);
			console.log("B2")

			return reply.code(200).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// GET A USER WITH AN IDENTIFIER (EMAIL OR USERNAME)
	userFastify.get('/lookup/:identifier', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ identifier } = request.params as { identifier: string };

			let	user: usersRespDto;
			if (!identifier.includes("@"))
				user = await usersServ.getUserByUsername(identifier);
			else
				user = await usersServ.getUserByEmail(identifier);

			return reply.code(200).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// ADD A USER
	userFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	newUser: usersAddDto = new usersAddDto(request.body);
			const	user: usersRespDto = await usersServ.addUser(newUser);

			return reply.code(201).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// UPDATE A USER WITH HIS ID
	userFastify.post<{ Body: userUpdate }>('/me/validate', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body) {
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}
		try {
			const	userId: number = extractUserId(request);

			const	oldUser: usersRespDto = await usersServ.getUserById(userId);
			const	userUpdate: usersUpdateDto = await new usersUpdateDto(request.body, oldUser);

			await usersServ.isPossibleUpdateUser(userId, userUpdate);

			return reply.code(201).send({ valid: true });
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// UPDATE A USER WITH HIS ID
	userFastify.patch<{ Body: userUpdate }>('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body) {
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}
		try {
			const	userId: number = extractUserId(request);

			const	oldUser: usersRespDto = await usersServ.getUserById(userId);
			const	userUpdate: usersUpdateDto = await new usersUpdateDto(request.body, oldUser);

			await usersServ.updateUserById(userId, userUpdate);

			return reply.code(201).send(userId);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// DELETE A USER WITH HIS ID
	userFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			await usersServ.deleteUser(parseId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});
}
