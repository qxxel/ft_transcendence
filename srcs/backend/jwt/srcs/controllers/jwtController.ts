/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 17:37:45 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import * as jose								from 'jose';
import { getCookies, setCookiesAccessToken }	from "../utils/cookies.js";
import { jwtGenerate, addJWT, removeJWT }		from "../utils/jwtManagement.js";

import { jwtServ, jwtSecret, expAccess }	from "../jwt.js";

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';
import type { userDto }											from "../dtos/userDto.js";


/* ====================== FUNCTIONS ====================== */

export async function	jwtController(jwtFastify: FastifyInstance) {
	jwtFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const user: userDto = request.body as userDto;
	
			await addJWT(reply, user);
	
			return reply.status(201).send(user);
		} catch (error) {
			console.log(error);
			reply.status(500).send(error);
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
		try {
			const cookies = getCookies(request);
	
			const { payload, protectedHeader } = await jose.jwtVerify(cookies.jwtRefresh, jwtSecret);
	
			const user: userDto = request.body as userDto;
			const jwtAccess: string = await jwtGenerate(user, expAccess);
			setCookiesAccessToken(reply, jwtAccess);
	
			return reply.status(201).send({ result: "ok" });
		} catch (err) {
			if (err instanceof jose.errors.JOSEError)
				return reply.status(401).send(err);
	
			console.log(err);
			reply.status(500).send(err);
		}
	});
	
	jwtFastify.get('/jwt', async (request, reply) => {		//
		return "Hello World!";								//	DEBUG: A ENLEVER !!
	});														//
}
