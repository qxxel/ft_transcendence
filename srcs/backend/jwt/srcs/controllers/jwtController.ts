/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 13:57:09 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import * as jose												from 'jose'
import { jwtServ, jwtSecret, expAccess, jwtAxios, jwtFastify }	from "../jwt.js"
import { getCookies, setCookiesAccessToken, removeCookies }		from "../utils/cookies.js"
import * as jwtError											from "../utils/throwErrors.js"
import { jwtGenerate, addJWT, addTwofaJWT, removeJWT }			from "../utils/jwtManagement.js"
import { errorsHandler }										from "../utils/errorsHandler.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { userDto }											from "../dtos/userDto.js"


/* ====================== FUNCTION ====================== */

async function	getPayloadTokenAccess(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtAccess)
			throw new jwtError.MissingTokenError("Token access missing!");

		const	payload: jose.JWTPayload = (await jose.jwtVerify(cookies.jwtAccess, jwtSecret)).payload;

		return reply.status(200).send(payload);
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	getPayloadTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtTwofa)
			throw new jwtError.MissingTokenError("Token twofa missing!");

		const	payload: jose.JWTPayload = (await jose.jwtVerify(cookies.jwtTwofa, jwtSecret)).payload;

		return reply.status(200).send(payload);
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}


async function	createdToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new jwtError.RequestEmptyError("The request is empty");
		
		const	user: userDto = request.body as userDto;

		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!")

		if (user.is2faEnable) {
			await addTwofaJWT(reply, user);
			
			return reply.status(201).send(user.id);
		}
		const	refreshToken: string = await addJWT(reply, user);

		const	lastId: number = await jwtServ.addToken(refreshToken, user.id);
		
		return reply.status(201).send(lastId);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	createdTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new jwtError.RequestEmptyError("The request is empty");
		
		const	user: userDto = request.body as userDto;

		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!")

		await addTwofaJWT(reply, user);
			
		return reply.status(201).send(user.id);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	validateTwofaCreatedToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtTwofa)
			throw new jwtError.MissingTokenError("Token twofa missing!");

		const	payload: jose.JWTPayload = (await jose.jwtVerify(cookies.jwtTwofa, jwtSecret)).payload;

		const	user: userDto = payload as any as userDto;

		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

		removeCookies(reply, "jwtTwofa", "/api");

		const	refreshToken: string = await addJWT(reply, user);

		await jwtServ.addToken(refreshToken, user.id)
		return reply.status(201).send(payload);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	recreatedToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtAccess)
			throw new jwtError.MissingTokenError("Token access missing!");

		const	payload: jose.JWTPayload = (await jose.jwtVerify(cookies.jwtAccess, jwtSecret)).payload;

		const	oldUser: userDto = payload as any as userDto;
		
		if (!oldUser || !oldUser.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

		const	resUser: AxiosResponse = await jwtAxios.get(`http://user:3000/me`, { headers: { 'user-id': oldUser.id } });
		const	newUser: userDto = resUser.data as userDto;

		if (!newUser || !newUser.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

		const	refreshToken: string = await addJWT(reply, newUser);

		const	lastId: number = await jwtServ.addToken(refreshToken, newUser.id)
		return reply.status(200).send(lastId);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	recreatedTokenTwofa(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies:  Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtTwofa)
			throw new jwtError.MissingTokenError("Token twofa missing!");

		const	payload: jose.JWTPayload = (await jose.jwtVerify(cookies.jwtTwofa, jwtSecret)).payload;
		
		const	user: userDto = payload as any as userDto;

		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!")

		await addTwofaJWT(reply, user);
		
		return reply.status(200).send(user.id);
	} catch (err: unknown) {
		removeJWT(reply);
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	refreshTokenAccess(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtRefresh)
			throw new jwtError.MissingTokenError("Token refresh missing!");
		
		
		const	payload: jose.JWTPayload = (await jose.jwtVerify(cookies.jwtRefresh, jwtSecret)).payload;

		if (!(await jwtServ.isValidToken(cookies.jwtRefresh)))
			throw new jwtError.UnauthorizedTokenError("invalid token");
		
		const	user: userDto = payload as any as userDto;

		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

		const	jwtAccess: string = await jwtGenerate(user, expAccess);
		setCookiesAccessToken(reply, jwtAccess);

		return reply.status(200).send({ result: "ok" });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	refreshTokenRefresh(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtRefresh)
			throw new jwtError.MissingTokenError("Token refresh missing!");
		
		const	payload: jose.JWTPayload = (await jose.jwtVerify(cookies.jwtRefresh, jwtSecret)).payload;

		if (await jwtServ.isValidToken(cookies.jwtRefresh))
			throw new jwtError.UnauthorizedTokenError("invalid token");
		
		const	user: userDto = payload as any as userDto;

		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

		const	refreshToken: string = await addJWT(reply, user);
		await jwtServ.addToken(refreshToken, user.id);

		return reply.status(200).send({ result: "ok" });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	deleteSessionToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies)
			throw new jwtError.MissingTokenError("Token missing!");
		
		let	payload: jose.JWTPayload;
		if (cookies.jwtAccess)
			payload = (await jose.jwtVerify(cookies.jwtAccess, jwtSecret)).payload;
		else if (cookies.jwtTwofa)
			payload = (await jose.jwtVerify(cookies.jwtTwofa, jwtSecret)).payload;
		else if (cookies.jwtRefresh) {
			payload = (await jose.jwtVerify(cookies.jwtRefresh, jwtSecret)).payload;
			if (await jwtServ.isValidToken(cookies.jwtRefresh))
				throw new jwtError.UnauthorizedTokenError("invalid token");
		} else
			throw new jwtError.MissingTokenError("Token missing!");

		const	user: userDto = payload as any as userDto;
		
		removeJWT(reply);

		if (cookies.jwtRefresh)
			await jwtServ.deleteToken(cookies.jwtRefresh);

		if (user && user.id) {
			try {
				await jwtAxios.delete(`http://ping:3000/${user.id}`);
			} catch (_error: unknown) {}
		}
		return reply.status(204).send({ result: "deleted." });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	deleteUserToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);

		let	payload: jose.JWTPayload;
		if (cookies.jwtAccess)
			payload = (await jose.jwtVerify(cookies.jwtAccess, jwtSecret)).payload;
		else if (cookies.jwtTwofa)
			payload = (await jose.jwtVerify(cookies.jwtTwofa, jwtSecret)).payload;
		else
			throw new jwtError.MissingTokenError("Token missing!");

		const	user: userDto = payload as any as userDto;
		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

		removeJWT(reply);

		await jwtServ.deleteTokenById(user.id);

		return reply.status(204).send({ result: "deleted." });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

export async function	jwtController(jwtFastify: FastifyInstance) {
	jwtFastify.get('/payload/access', getPayloadTokenAccess);
	jwtFastify.get('/payload/twofa', getPayloadTokenTwofa);

	jwtFastify.post('/', createdToken);
	jwtFastify.post('/twofa', createdTokenTwofa);
	jwtFastify.post('/twofa/validate', validateTwofaCreatedToken);
	
	jwtFastify.patch('/refresh', recreatedToken);
	jwtFastify.patch('/twofa/recreat', recreatedTokenTwofa);
	jwtFastify.patch('/refresh/access', refreshTokenAccess);
	jwtFastify.patch('/refresh/refresh', refreshTokenRefresh);

	jwtFastify.delete('/refresh/logout', deleteSessionToken);
	jwtFastify.delete('/me', deleteUserToken);
}
