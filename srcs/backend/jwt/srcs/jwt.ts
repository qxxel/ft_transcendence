/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/04 18:21:00 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR JWT SERVICE


/* ====================== IMPORTS ====================== */

import cors					from '@fastify/cors'
import Fastify, { type FastifyInstance }				from 'fastify'
import fs					from 'fs'
import axios				from 'axios'
import https				from 'https'
import sqlite3Pkg			from 'sqlite3'
import { jwtController }	from "./controllers/jwtController.js"
import { jwtService }		from "./services/jwtService.js"
import { jwtRepository }	from "./repositories/jwtRepository.js"


/* ====================== TOKENS VARIABLES ====================== */

export const	expAccess: string = "1000s";
export const	expRefresh: string = "10000s";
export const	expTwofa: string = "300s"; // 300s = 5min

export const	jwtSecret: Uint8Array<ArrayBuffer> = new TextEncoder().encode(process.env.JWT_SECRET);


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/jwt.db';

const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	jwtServ: jwtService = new jwtService(new jwtRepository(db));


/* ====================== AXIOS VARIABLES ====================== */

export const	jwtAxios = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	timeout: 1000
});


/* ====================== SERVER ====================== */

export const	jwtFastify: FastifyInstance = Fastify({
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

jwtFastify.register(jwtController);

const	start = async () => {
	try {
		await jwtFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://jwt:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			jwtFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err: unknown) {
		jwtFastify.log.error(err);
		process.exit(1);
	}
};
start();
