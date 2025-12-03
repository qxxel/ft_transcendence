/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 18:42:25 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import * as jose											from 'jose'
import { getCookies, setCookiesAccessToken, removeCookies }	from "../utils/cookies.js"
import { jwtGenerate, addJWT, addTwofaJWT, removeJWT }		from "../utils/jwtManagement.js"
import { jwtServ, jwtSecret, expAccess, jwtAxios }			from "../jwt.js"
import { MissingIdError }									from "../utils/throwErrors.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { AxiosResponse }									from 'axios'
import type { userDto }											from "../dtos/userDto.js"


/* ====================== FUNCTION ====================== */

async function	createdToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	user: userDto = request.body as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !")

		if (user.is2faEnable) {
			await addTwofaJWT(reply, user);
			
			return reply.status(201).send(user.id);
		}
		const	refreshToken: string = await addJWT(reply, user);

		const	lastId: number = await jwtServ.addToken(refreshToken, user.id)
		return reply.status(201).send(lastId);
	} catch (err: unknown) {
		removeJWT(reply);

		if (err instanceof MissingIdError) {
			console.error(err.message);
			reply.status(401).send(err.message);
		}

		console.error(err);
		return reply.status(500).send(err);
	}
}

async function	createdTokenForEmailVerfication(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	user: userDto = request.body as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !")

		await addTwofaJWT(reply, user);
			
		return reply.status(201).send(user.id);
	} catch (err: unknown) {
		removeJWT(reply);

		if (err instanceof MissingIdError) {
			console.error(err.message);
			reply.status(401).send(err.message);
		}

		console.error(err);
		return reply.status(500).send(err);
	}
}

async function	recreatedTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	payload: AxiosResponse = await jwtAxios.get("https://jwt:3000/twofa", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		const	user: userDto = payload.data as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !")

		await addTwofaJWT(reply, user);
		return reply.status(201).send(user.id);
	} catch (err: unknown) {
		removeJWT(reply);

		if (err instanceof MissingIdError) {
			console.error(err.message);
			reply.status(401).send(err.message);
		}

		console.error(err);
		return reply.status(500).send(err);
	}
}

async function	getPayloadTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);

		return reply.status(201).send(payload);
	} catch (err: unknown) {
		if (err instanceof jose.errors.JOSEError)
		{
			console.error(err.message);	
			return reply.status(401).send(err.message);
		}

		console.log(err);
		return reply.status(500).send(err);
	}
}

async function	removeTokenTwofaCreatedToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);

		const user: userDto = payload as any as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !")

		removeCookies(reply, "jwtTwofa", "/api");

		const	refreshToken: string = await addJWT(reply, user);

		const	lastId: number = await jwtServ.addToken(refreshToken, user.id)
		return reply.status(201).send(payload);
	} catch (err: unknown) {
		if (err instanceof jose.errors.JOSEError)
		{
			console.error(err.message);	
			return reply.status(401).send(err.message);
		}

		console.log(err);
		return reply.status(500).send(err);
	}
}

async function	getPayloadTokenAccess(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
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
		return reply.status(500).send(err);
	}
}

async function	refreshTokenAccess(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
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
		return reply.status(500).send(err);
	}
}

async function	deleteSessionToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
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
		return reply.status(500).send(err);
	}
}

async function	deleteUserToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
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
		return reply.status(500).send(err);
	}
}

export async function	jwtController(jwtFastify: FastifyInstance) {
	// order get / post / delete
	jwtFastify.post('/', createdToken);
	jwtFastify.post('/verifyEmail', createdTokenForEmailVerfication);
	jwtFastify.post('/twofa/refresh', recreatedTokenTwofa);

	jwtFastify.get('/twofa', getPayloadTokenTwofa);
	jwtFastify.get('/twofa/validate', removeTokenTwofaCreatedToken); // post ???
	jwtFastify.get('/validate', getPayloadTokenAccess);
	jwtFastify.post('/refresh', refreshTokenAccess);

	jwtFastify.delete('/refresh/logout', deleteSessionToken);
	jwtFastify.delete('/:id', deleteUserToken); // replace with /me ???
}
