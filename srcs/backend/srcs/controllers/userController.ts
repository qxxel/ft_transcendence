/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:15:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/08 16:36:58 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Handle the get, post, and all the info that fastify receive


/* ====================== IMPORT ====================== */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { userServ, jwtSecret } from "../index.js";
import { userDto } from "../dtos/userDto.js";
const jose = require("jose");

const expAccess = "10s";
const expRefresh = "1m";

/* ====================== FUNCTIONS ====================== */

async function	jwtGenerate(user: userDto, exp: string) {
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

function	getCookies(request: FastifyRequest) {
	const cookies = Object.fromEntries(
		(request.headers.cookie || "")
		.split("; ")
		.map(c => c.split("="))
	)
	return cookies
}

function	setCookiesAccessToken(reply: FastifyReply, jwtAccess: string) {
	reply.header(
		"Set-Cookie",
		`jwtAccess=${jwtAccess}; SameSite=strict; HttpOnly; secure; Max-Age=10; path=/api/user/auth`
	);
}

function	setCookiesAccessRefresh(reply: FastifyReply, jwtRefresh: string) {
	reply.header(
		"Set-Cookie",
		`jwtRefresh=${jwtRefresh}; SameSite=strict; HttpOnly; secure; Max-Age=60; path=/api/user/auth/refresh`
	);
}

async function	addJWT(reply: FastifyReply, user: userDto) {

	const jwtAccess: string = await jwtGenerate(user, expAccess);
	setCookiesAccessToken(reply, jwtAccess);

	const jwtRefresh: string = await jwtGenerate(user, expRefresh);
	setCookiesAccessRefresh(reply, jwtRefresh);
}

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
		const cookies = getCookies(request);
		const accessToken = cookies.jwtAccess;
		
		try {
			const { payload, protectedHeader } = await jose.jwtVerify(accessToken, jwtSecret);
			const user = await userServ.getUserById(payload.id);

			return reply.status(201).send(user);
		} catch (err) {
			if (err instanceof jose.errors.JOSEError)
				return reply.status(401).send({error: "Invalid token"});
			else
				return reply.status(404).send({error: err});
		}
	});
	
	fastify.get('/auth/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
		const cookies = getCookies(request);
		const refreshToken = cookies.jwtRefresh;

		try {
			const { payload, protectedHeader } = await jose.jwtVerify(refreshToken, jwtSecret)
			const user = await userServ.getUserById(payload.id);
				
			await addJWT(reply, user);
			
			return await reply.status(201).send(user);
		} catch (err) {
			if (err instanceof jose.errors.JOSEError)
				return reply.status(401).send({error: "Invalid token"});
			else
				return reply.status(404).send({error: err});
		}
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
