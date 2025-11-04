/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:15:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/04 16:33:30 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// handle the get, post, and all the info that fastify receive

import { FastifyInstance } from 'fastify';
import { userServ } from "../index.js";
import { userDto } from "../dtos/userDto.js";
// import { userRepository } from "../tableRepositories/userRepository.js";


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
			const	user = await userServ.addUser(newUser);

			reply.code(201);
			return user;
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
