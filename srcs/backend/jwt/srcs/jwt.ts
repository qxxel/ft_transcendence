/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/16 18:32:08 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import Fastify from 'fastify';
import cors from '@fastify/cors'
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import * as jose from 'jose';
import sqlite3Pkg from 'sqlite3';

import type { FastifyRequest, FastifyReply } from 'fastify';

import { jwtController }	from './controllers/jwtController.js';
import { jwtService }		from './services/jwtService.js';
import { jwtRepository }	from './repositories/jwtRepository.js';

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
		`jwtAccess=${jwtAccess}; SameSite=strict; HttpOnly; secure; Max-Age=10; path=/api/jwt/`
	);
}

function	setCookiesRefreshToken(reply: FastifyReply, jwtRefresh: string) {
	reply.header(
		"Set-Cookie",
		`jwtRefresh=${jwtRefresh}; SameSite=strict; HttpOnly; secure; Max-Age=60; path=/api/jwt/refresh`
	);
}

async function	addJWT(reply: FastifyReply, user: userDto) {

	const jwtAccess: string = await jwtGenerate(user, expAccess);
	setCookiesAccessToken(reply, jwtAccess);

	const jwtRefresh: string = await jwtGenerate(user, expRefresh);
	setCookiesRefreshToken(reply, jwtRefresh);
}


function	removeCookies(reply: FastifyReply, key: string) {
	reply.header(
		"Set-Cookie",
		`${key}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
	);
}

export async function	removeJWT(reply: FastifyReply) {
	removeCookies(reply, "jwtAccess");
	removeCookies(reply, "jwtRefresh");
}


function	getCookies(request: FastifyRequest) {
	const cookies = Object.fromEntries(
		(request.headers.cookie || "")
		.split("; ")
		.map(c => c.split("="))
	)
	return cookies
}


/* ====================== DATABASE ====================== */

const			{ Database } = sqlite3Pkg;
const			dbname = '/app/dist/db/jwt.db';
export const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	jwtServ = new jwtService(new jwtRepository(db));


/* ====================== SERVER ====================== */

const	jwtFastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});


jwtFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

jwtFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const user: userDto = request.body as userDto;

		await addJWT(reply, user);
console.log(user);
		return reply.status(201).send(user);
	} catch (error) {
		console.log(error);
		reply.status(500).send(error);
	}
	return { message: "Hello World!"};
});

jwtFastify.get('/validate', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const cookies = getCookies(request);

		console.log("cookies1:" + request.headers.cookie)
		console.log("cookies2:" + cookies.jwtAccess)
		

		return reply.status(201).send();
	} catch (error) {
		console.log(error);
		reply.status(500).send(error);
	}
	return { message: "Hello World!"};
});


jwtFastify.register(jwtController);

jwtFastify.get('/jwt', async (request, reply) => {
	return "Hello World!";
});

const start = async () => {
	try {
		await jwtFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://jwt:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			jwtFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		jwtFastify.log.error(err);
		process.exit(1);
	}
};
start();