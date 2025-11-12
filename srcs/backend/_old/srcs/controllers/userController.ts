/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:15:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/09 19:56:59 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Handle the get, post, and all the info that fastify receive


/* ====================== IMPORT ====================== */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { userServ } from "../index.js";
import { userDto } from "../dtos/userDto.js";
import { addJWT, accessToken } from "../jwt/VerifyToken.js";

/* ====================== FUNCTIONS ====================== */

export default async function	userController(fastify: FastifyInstance, options: any) {
	fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const { id } = request.params as { id: string };
		const parseId = parseInt(id, 10);

		try {
			return await userServ.getUserById(parseId);
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});

	fastify.get('/auth', async (request: FastifyRequest, reply: FastifyReply) => {
		return await accessToken(request, reply);
	});

	fastify.post('/2fa', async (request: FastifyRequest, reply: FastifyReply) => {
		// return await refreshToken(request, reply);
	});
	
	fastify.post('/sign-up', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			reply.code(400);
			return "The request is empty";
		}

		try {
			const	newUser = new userDto(request.body);
			const	user = await userServ.addUser(newUser);

			await addJWT(reply, user);

			reply.code(201);
			return user;
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});

	fastify.post('/sign-in', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			reply.code(400);
			return "The request is empty";
		}

		const	row = request.body as any;
		try {
			const user = await userServ.getUserByIdentifier(row.identifier);
			if (user.getPwd() !== row.password)
				throw new Error("Wrong password.");

			await addJWT(reply, user);
			
			return user;
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});

	fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const { id } = request.params as { id: string };
		const parseId = parseInt(id, 10);
	
		try {
			await userServ.deleteUser(parseId);
			return { message: `user ${parseId} deleted.`, id: parseId };
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});
}
