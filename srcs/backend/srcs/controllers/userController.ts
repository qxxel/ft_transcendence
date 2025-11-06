/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:15:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/06 11:07:31 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// handle the get, post, and all the info that fastify receive

import { FastifyInstance, FastifyRequest } from 'fastify';
import { userServ, jwtSecret } from "../index.js";
import { userDto } from "../dtos/userDto.js";
const jose = require("jose");

const expAccess = "10s";
const expRefresh = "10s";


async function	jwtGenerate(user: userDto, exp: string)
{
	const jwt: string = await new jose.SignJWT( {
			'id': user.getId(),
			'username': user.getName(),
			'email': user.getEmail()
		})
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setIssuedAt()
		.setExpirationTime(exp)
		.sign(jwtSecret);

	return jwt;
}

export default async function	userController(fastify: FastifyInstance, options: any) {
	fastify.get('/:id', async (request: FastifyRequest, reply) => {
		const { id } = request.params as { id: string };
		const parseId = parseInt(id, 10);

		console.log("🍪 cookie:", request.headers.cookie);

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

			const jwtAccess: string = await jwtGenerate(user, expAccess)
				.catch(() => {return ""}); // /!\ ???
			
			const jwtRefresh: string = await jwtGenerate(user, expRefresh)
				.catch(() => {return ""}); // /!\ ???
			
			reply.header(
				"Set-Cookie",
				`jwtRefresh=${jwtRefresh}; HttpOnly; secure; Max-Age=10`
			);
			reply.header(
				"Set-Cookie",
				`jwtAccess=${jwtAccess}; HttpOnly; secure; Max-Age=10`
			);

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
			await userServ.deleteUser(parseId);
			return { message: `user ${parseId} deleted.`, id: parseId };
		}
		catch (err) {
			reply.code(400);
			return err;
		}
	});
}
