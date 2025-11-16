/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/16 00:38:16 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import Fastify from 'fastify';
import cors from '@fastify/cors'
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import * as jose from 'jose';

import type { FastifyRequest, FastifyReply } from 'fastify';

interface userDto {
	id?: number;
	username: string;
	email: string;
	password: string;
	elo?: number;
}

const expAccess = "10s";
const expRefresh = "1m";

/* ====================== FUNCTIONS ====================== */

const	jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);


async function	jwtGenerate(user: userDto, exp: string): Promise<string> {
	return await new jose.SignJWT( {
			'id': user.id,
			'username': user.username,
			'email': user.email
		})
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setIssuedAt()
		.setExpirationTime(exp)
		.sign(jwtSecret);
}

// hostOnly ???
function	setCookiesAccessToken(reply: FastifyReply, jwtAccess: string) {
	reply.header(
		"Set-Cookie",
		`jwtAccess=${jwtAccess}; SameSite=strict; HttpOnly; secure; Max-Age=10; path=/api/auth`
	);
}

function	setCookiesRefreshToken(reply: FastifyReply, jwtRefresh: string) {
	reply.header(
		"Set-Cookie",
		`jwtRefresh=${jwtRefresh}; SameSite=strict; HttpOnly; secure; Max-Age=60; path=/api/auth/refresh`
	);
}

async function	addJWT(reply: FastifyReply, user: userDto) {

	const jwtAccess: string = await jwtGenerate(user, expAccess);
	setCookiesAccessToken(reply, jwtAccess);

	const jwtRefresh: string = await jwtGenerate(user, expRefresh);
	setCookiesRefreshToken(reply, jwtRefresh);
}


/* ====================== SERVER ====================== */

const	fastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

fastify.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const user :userDto = request.body as userDto;
		
		await addJWT(reply, user);

		return reply.status(201).send(user);
		
	} catch (error) {
		console.log(error);
		reply.status(600).send(error);
	}
	return { message: "Hello World!"};
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://jwt:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			fastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();