/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 20:08:51 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import * as jose								from 'jose';
import { getCookies, setCookiesAccessToken }	from "../utils/cookies.js";
import { jwtGenerate, addJWT, removeJWT }		from "../utils/jwtManagement.js";
import { MissingIdError }						from "../utils/throwErrors.js";

import { jwtServ, jwtSecret, expAccess }	from "../jwt.js";

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';
import type { userDto }											from "../dtos/userDto.js";


/* ====================== FUNCTIONS ====================== */

export async function	jwtController(jwtFastify: FastifyInstance) {
	jwtFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const user: userDto = request.body as userDto;

			const refreshToken = await addJWT(reply, user);

			if (!user.id)
				throw new MissingIdError("Id of the user is missing !")
			const	lastId: number = await jwtServ.addToken(refreshToken, user.id)

			return reply.status(201).send(lastId);
		} catch (err) {
			removeJWT(reply);

			if (err instanceof MissingIdError) {
				console.error(err.message);
				reply.status(401).send(err.message);
			}

			console.error(err);
			reply.status(500).send(err);
		}
	});

	jwtFastify.get('/validate', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const cookies = getCookies(request);
			const { payload, protectedHeader } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret);

			return reply.status(201).send({ result: "valid." });
		} catch (err) {
			if (err instanceof jose.errors.JOSEError)
				return reply.status(401).send(err);

			console.log(err);
			reply.status(500).send(err);
		}
	});

	jwtFastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
		const cookies = getCookies(request);
		if (!cookies)
			return reply.status(401).send("Can't get the refresh token in cookies.");

		try {
			const salut = await jwtServ.getClientIdByToken(cookies.jwtRefresh)
			console.log(salut);

			const { payload, protectedHeader } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret);

			const user: userDto = request.body as userDto;
			const jwtAccess: string = await jwtGenerate(user, expAccess);
			setCookiesAccessToken(reply, jwtAccess);

			return reply.status(201).send({ result: "ok" });
		} catch (err) {
			if (err instanceof jose.errors.JOSEError)
			{
				await jwtServ.deleteToken(cookies.jwtRefresh);
				console.error(err.message);
				return reply.status(401).send(err);
			}

			console.log(err);
			reply.status(500).send(err);
		}
	});

	jwtFastify.get('/jwt', async (request, reply) => {		//
		return "Hello World!";								//	DEBUG: A ENLEVER !!
	});														//
}
