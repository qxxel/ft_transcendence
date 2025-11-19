/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:09:58 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import * as jose								from 'jose'
import { getCookies, setCookiesAccessToken }	from "../utils/cookies.js"
import { jwtGenerate, addJWT, removeJWT }		from "../utils/jwtManagement.js"
import { jwtServ, jwtSecret, expAccess }		from "../jwt.js"
import { MissingIdError }						from "../utils/throwErrors.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { userDto }											from "../dtos/userDto.js"


/* ====================== FUNCTION ====================== */

export async function	jwtController(jwtFastify: FastifyInstance) {
	jwtFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	user: userDto = request.body as userDto;

			const	refreshToken: string = await addJWT(reply, user);

			if (!user.id)
				throw new MissingIdError("Id of the user is missing !")

			const	lastId: number = await jwtServ.addToken(refreshToken, user.id)

			return reply.status(201).send(lastId);
		} catch (err: unknown) {
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
			const	cookies: any = getCookies(request);
			const	{ payload, protectedHeader } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret) as { payload: string, protectedHeader: jose.JWTHeaderParameters }; // BIG LINE (MAYBE SEARCH SOLUTION)

			return reply.status(200).send(payload);
		} catch (err: unknown) {
			if (err instanceof jose.errors.JOSEError)
			{
				console.error(err.message);	
				return reply.status(401).send(err.message);
			}

			console.log(err);
			reply.status(500).send(err);
		}
	});

	jwtFastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
		const	cookies: any = getCookies(request);
		if (!cookies)
			return reply.status(401).send({ error: "Can't get the refresh token in cookies." });

		try {
			
			const	{ payload, protectedHeader } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret) as { payload: string, protectedHeader: jose.JWTHeaderParameters }; // BIG LINE (MAYBE SEARCH SOLUTION)

			if (await jwtServ.isValidToken(cookies.jwtRefresh))
				throw jose.errors.JOSEError;
			
			const	user: userDto = request.body as userDto;
			const	jwtAccess: string = await jwtGenerate(user, expAccess);
			setCookiesAccessToken(reply, jwtAccess);

			return reply.status(201).send({ result: "ok" });
		} catch (err: unknown) {
			if (err instanceof jose.errors.JOSEError)
			{
				await jwtServ.deleteToken(cookies.jwtRefresh);
				console.error(err.message);
				return reply.status(401).send(err.message);
			}

			console.log(err);
			reply.status(500).send(err);
		}
	});

	jwtFastify.delete('/refresh/logout', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	cookies: any = getCookies(request);

			removeJWT(reply);

			await jwtServ.deleteToken(cookies.jwtRefresh);

			return reply.status(204).send({ result: "deleted." });
		} catch (err: unknown) {
			if (err instanceof jose.errors.JOSEError)
			{
				console.error(err.message);
				return reply.status(401).send(err.message);
			}

			console.log(err);
			reply.status(500).send(err);
		}
	});

	jwtFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);
	
		try {
			removeJWT(reply);

			await jwtServ.deleteTokenById(parseId);

			return reply.status(204).send({ result: "deleted." });
		} catch (err: unknown) {
			if (err instanceof jose.errors.JOSEError)
			{
				console.error(err.message)
				return reply.status(401).send(err.message);
			}

			console.log(err);
			reply.status(500).send(err);
		}
	});
}
