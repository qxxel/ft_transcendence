/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:40:16 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:28:56 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import { errorsHandler }	from "../utils/errorsHandler.js"
import { userAddDto }		from "../dtos/userAddDto.js"
import { userRespDto }		from "../dtos/userRespDto.js"
import { userServ } 		from "../user.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	userController(userFastify: FastifyInstance): Promise<void> {
	// GET A USER WITH HIS ID
	userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	user: userRespDto = await userServ.getUserById(parseId);

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
				var	user: userRespDto = await userServ.getUserByUsername(identifier);
			else
				var	user: userRespDto = await userServ.getUserByEmail(identifier);

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
			const	newUser: userAddDto = new userAddDto(request.body);
			const	user: userRespDto = await userServ.addUser(newUser);

			return reply.code(201).send(user);
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
			await userServ.deleteUser(parseId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});
}
