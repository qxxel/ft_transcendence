/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:15:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/05 10:51:12 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Handle the get, post, and all the info that fastify receive


/* ====================== IMPORT ====================== */

import { FastifyInstance } from 'fastify';
import { userServ } from "../index.js";
import { userDto } from "../dtos/userDto.js";


/* ====================== FUNCTIONS ====================== */

export default async function	userController(fastify: FastifyInstance, options: any) {
	fastify.get('/:id', async (request, reply) => {
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

	fastify.post('/sign-up', async (request, reply) => {
		if (!request.body)
		{
			reply.code(400);
			return "The request is empty";
		}

		try {
			const	newUser = new userDto(request.body);
			const	userId = await userServ.addUser(newUser);
	
			reply.code(201);
			return { message: "User created successfully.", id: `${userId}`};
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});

	fastify.post('/sign-in', async (request, reply) => {
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

			return user;
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});

	fastify.delete('/:id', async (request, reply) => {
		const { id } = request.params as { id: string };
		const parseId = parseInt(id, 10);
	
		try {
			return await userServ.deleteUser(parseId);
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});
}
