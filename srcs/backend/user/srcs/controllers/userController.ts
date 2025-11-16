/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:40:16 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 14:27:12 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';

import { userServ } 	from "../user.js";
import { userAddDto }	from "../dtos/userAddDto.js";
import { userRespDto }	from "../dtos/userRespDto.js";

import { errorsHandler }				from '../utils/errorsHandler.js';


/* ====================== FUNCTIONS ====================== */

export async function	userController(userFastify: FastifyInstance) {
	// GET A USER WITH HIS ID
	userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const { id } = request.params as { id: string };
		const parseId = parseInt(id, 10);

		try {
			const	user: userRespDto = await userServ.getUserById(parseId);

			return reply.code(200).send(user);
		}
		catch (err) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// GET A USER WITH AN IDENTIFIER (EMAIL OR USERNAME)
	userFastify.get('/lookup/:identifier', async (request: FastifyRequest, reply: FastifyReply) => {
		const { identifier } = request.params as { identifier: string };

		try {
			if (!identifier.includes("@"))
				var	user: userRespDto = await userServ.getUserByUsername(identifier);
			else
				var	user: userRespDto = await userServ.getUserByEmail(identifier);

			return reply.code(200).send(user);
		}
		catch (err) {
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
			const	newUser = new userAddDto(request.body);
			const	user: userRespDto = await userServ.addUser(newUser);

			return reply.code(201).send(user);
		}
		catch (err) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// DELETE A USER WITH HIS ID
	userFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const { id } = request.params as { id: string };
		const parseId: number = parseInt(id, 10);
	
		try {
			console.log("1");
			await userServ.deleteUser(parseId);

			console.log("6");
			return reply.code(204).send();
		}
		catch (err) {
			console.log("7");
			return errorsHandler(userFastify, reply, err);
		}
	});
}
