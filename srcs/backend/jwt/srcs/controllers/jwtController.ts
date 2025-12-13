/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:47:41 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import * as jose												from 'jose'
import { getCookies, setCookiesAccessToken, removeCookies }		from "../utils/cookies.js"
import { jwtGenerate, addJWT, addTwofaJWT, removeJWT }			from "../utils/jwtManagement.js"
import { jwtServ, jwtSecret, expAccess, jwtAxios, jwtFastify }	from "../jwt.js"
import * as jwtError											from "../utils/throwErrors.js"
import { errorsHandler }										from "../utils/errorsHandler.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { AxiosResponse }									from 'axios'
import type { userDto }											from "../dtos/userDto.js"


/* ====================== FUNCTION ====================== */

async function	getPayloadTokenAccess(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtAccess)
			throw new jwtError.MissingTokenError("Token access missing!");

		const	{ payload } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret);

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

		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);

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

		await jwtAxios.post('http://user:3000/log', { isLog: true }, { headers: { 'user-id': user.id } } );
		
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

		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);

		const	user: userDto = payload as any as userDto;

		if (!user || !user.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

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
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies.jwtAccess)
			throw new jwtError.MissingTokenError("Token access missing!");

		const	{ payload } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret);

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

		const	{ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret);
		
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
		
		
		const	{ payload } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret);

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
		
		const	{ payload } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret);

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
		
		let	payload;
		if (cookies.jwtAccess)
			({ payload } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret));
		else if (cookies.jwtTwofa)
			({ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret));
		else if (cookies.jwtRefresh) {
			({ payload } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret));
			if (await jwtServ.isValidToken(cookies.jwtRefresh))
				throw new jwtError.UnauthorizedTokenError("invalid token");
		} else
			throw new jwtError.MissingTokenError("Token missing!");

		removeJWT(reply);

		if (cookies.jwtRefresh)
			await jwtServ.deleteToken(cookies.jwtRefresh);

		if (payload && payload.id)
			await jwtAxios.post('http://user:3000/log', { isLog: false }, { headers: { 'user-id': payload.id } } );

		return reply.status(204).send({ result: "deleted." });
	} catch (err: unknown) {
		return errorsHandler(jwtFastify, reply, err);
	}
}

async function	deleteUserToken(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);

		let	payload;
		if (cookies.jwtAccess)
			({ payload } = await jose.jwtVerify(cookies.jwtAccess, jwtSecret));
		else if (cookies.jwtTwofa)
			({ payload } = await jose.jwtVerify(cookies.jwtTwofa, jwtSecret));
		else
			throw new jwtError.MissingTokenError("Token missing!");

		if (!payload || !payload.id)
			throw new jwtError.MissingIdError("Id of the user is missing!");

		removeJWT(reply);

		await jwtServ.deleteTokenById(payload.id);

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
