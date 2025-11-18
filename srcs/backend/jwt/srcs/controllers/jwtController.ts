/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 19:04:49 by mreynaud         ###   ########.fr       */
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

			return reply.status(200).send(payload);
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

	jwtFastify.delete('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const cookies = getCookies(request);

			removeJWT(reply);
			await jwtServ.deleteToken(cookies.jwtRefresh);

			return reply.status(204).send({ result: "deleted." });
		} catch (err) {
			if (err instanceof jose.errors.JOSEError)
				return reply.status(401).send(err);

			console.log(err);
			reply.status(500).send(err);
		}
	});

}
