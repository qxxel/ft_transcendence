/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:40:16 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/29 12:02:35 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR USERS TABLE


/* ====================== IMPORTS ====================== */

import { errorsHandler }	from "../utils/errorsHandler.js"
import { usersAddDto }		from "../dtos/usersAddDto.js"
import { usersRespDto }		from "../dtos/usersRespDto.js"
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
	userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	user: usersRespDto = await usersServ.getUserById(parseId);

			return reply.code(200).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// GET A USER WITH AN IDENTIFIER (EMAIL OR USERNAME)
	userFastify.get('/lookup/:identifier', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ identifier } = request.params as { identifier: string };

		try {
			if (!identifier.includes("@"))
				var	user: usersRespDto = await usersServ.getUserByUsername(identifier);
			else
				var	user: usersRespDto = await usersServ.getUserByEmail(identifier);

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
	userFastify.post<{ Body: userUpdate }>('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body) {
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);
	
		try {
			const	oldUser: usersRespDto = await usersServ.getUserById(parseId);
			const	userUpdate: userUpdate = request.body;

			if (userUpdate.username && userUpdate.username !== oldUser.getUsername())
				await usersServ.updateUsernameById(parseId, userUpdate.username);

			if (userUpdate.email && userUpdate.email !== oldUser.getEmail())
				await usersServ.updateEmailById(parseId, userUpdate.email);

			if (userUpdate.avatar && userUpdate.avatar !== oldUser.getAvatar())
				await usersServ.updateAvatarById(parseId, userUpdate.avatar);
			
			if (userUpdate.is2faEnable && userUpdate.is2faEnable !== oldUser.getIs2faEnable())
				await usersServ.update2faById(parseId, userUpdate.is2faEnable);

			return reply.code(201).send(parseId);
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
