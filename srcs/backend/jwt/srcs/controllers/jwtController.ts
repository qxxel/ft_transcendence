/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/11 18:56:40 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import * as jose												from 'jose'
import { getCookies, setCookiesAccessToken, removeCookies }		from "../utils/cookies.js"
import { jwtGenerate, addJWT, addTwofaJWT, removeJWT }			from "../utils/jwtManagement.js"
import { jwtServ, jwtSecret, expAccess, jwtAxios, jwtFastify }	from "../jwt.js"
import { MissingIdError }										from "../utils/throwErrors.js"
import { errorsHandler }										from "../utils/errorsHandler.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { AxiosResponse }									from 'axios'
import type { userDto }											from "../dtos/userDto.js"


/* ====================== FUNCTION ====================== */

async function	getPayloadTokenAccess(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		const	{ payload, protectedHeader } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret) as { payload: string, protectedHeader: jose.JWTHeaderParameters }; // BIG LINE (MAYBE SEARCH SOLUTION)

		return reply.status(200).send(payload);
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	getPayloadTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);

		return reply.status(201).send(payload);
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}


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

		const	lastId: number = await jwtServ.addToken(refreshToken, user.id);

		await jwtAxios.post('http://user:3000/log', { isLog: true }, { headers: { 'user-id': user.id } } );
		
		return reply.status(201).send(lastId);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	createdTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	user: userDto = request.body as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !")

		await addTwofaJWT(reply, user);
			
		return reply.status(201).send(user.id);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	recreatedTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);
		
		const	user: userDto = payload as any as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !")

		await addTwofaJWT(reply, user);
		return reply.status(201).send(user.id);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	validateTwofaCreatedToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);

		const	user: userDto = payload as any as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !");

		removeCookies(reply, "jwtTwofa", "/api");

		const	refreshToken: string = await addJWT(reply, user);

		await jwtAxios.post('http://user:3000/log', { isLog: true }, { headers: { 'user-id': user.id } } );

		await jwtServ.addToken(refreshToken, user.id)
		return reply.status(201).send(payload);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	recreatedToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		const	{ payload } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret);

		const	oldUser: userDto = payload as any as userDto;
		
		if (!oldUser.id)
			throw new MissingIdError("Id of the user is missing !");

		const	resUser: AxiosResponse = await jwtAxios.get(`http://user:3000/me`, { headers: { 'user-id': oldUser.id } });
		const	newUser: userDto = resUser.data as userDto;

		if (!newUser.id)
			throw new MissingIdError("Id of the user is missing !");

		const	refreshToken: string = await addJWT(reply, newUser);

		const	lastId: number = await jwtServ.addToken(refreshToken, newUser.id)
		return reply.status(201).send(lastId);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	refreshTokenAccess(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		if (!cookies)
			return reply.status(401).send({ error: "Can't get the refresh token in cookies." }); // throw
		
		const	{ payload } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret);

		if (await jwtServ.isValidToken(cookies.jwtRefresh))
			throw jose.errors.JOSEError;
		
		const	user: userDto = payload as any as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !");

		const	jwtAccess: string = await jwtGenerate(user, expAccess);
		setCookiesAccessToken(reply, jwtAccess);

		return reply.status(201).send({ result: "ok" });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	refreshTokenRefresh(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		if (!cookies)
			return reply.status(401).send({ error: "Can't get the refresh token in cookies." }); // throw
		
		const	{ payload } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret);

		if (await jwtServ.isValidToken(cookies.jwtRefresh))
			throw jose.errors.JOSEError;
		
		const	user: userDto = payload as any as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !");

		const	refreshToken: string = await addJWT(reply, user);
		await jwtServ.addToken(refreshToken, user.id);

		return reply.status(201).send({ result: "ok" });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	deleteSessionToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		
		let	payload;
		try {
			({ payload } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret));
		} catch (error) {
			try {
				({ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret));
			} catch (error) {
				({ payload } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret));
			}
		}

		const	user: userDto = payload as any as userDto;

		removeJWT(reply);

		await jwtServ.deleteToken(cookies.jwtRefresh);
		await jwtAxios.post('http://user:3000/log', { isLog: false }, { headers: { 'user-id': user.id } } );

		return reply.status(204).send({ result: "deleted." });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	deleteUserToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: any = getCookies(request);
		let		payload;
		try {
			({ payload } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret));
		} catch (error) {
			({ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret));	
		}

		const	user: userDto = payload as any as userDto;

		if (!user.id)
			throw new MissingIdError("Id of the user is missing !");

		removeJWT(reply);

		await jwtServ.deleteTokenById(user.id);

		return reply.status(204).send({ result: "deleted." });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

export async function	jwtController(jwtFastify: FastifyInstance) {
	// order get / post / patch / delete
	jwtFastify.get('/payload/access', getPayloadTokenAccess); // /validate
	jwtFastify.get('/payload/twofa', getPayloadTokenTwofa); // /twofa

	jwtFastify.post('/', createdToken);
	jwtFastify.post('/twofa', createdTokenTwofa); // /verifyEmail
	jwtFastify.post('/twofa/validate', validateTwofaCreatedToken); // get to post // 
	
	jwtFastify.patch('/refresh', recreatedToken); // add
	jwtFastify.patch('/twofa/recreat', recreatedTokenTwofa); // post to patch // /twofa/refresh
	jwtFastify.patch('/refresh/access', refreshTokenAccess); // post to patch // /refresh
	jwtFastify.patch('/refresh/refresh', refreshTokenRefresh); // add

	jwtFastify.delete('/refresh/logout', deleteSessionToken); // /refresh/logout
	jwtFastify.delete('/me', deleteUserToken); // replace with /me ???
}
