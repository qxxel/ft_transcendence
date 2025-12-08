/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/07 14:10:11 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR JWT SERVICE


/* ====================== IMPORTS ====================== */

import cors					from '@fastify/cors'
import Fastify, { type FastifyInstance }				from 'fastify'
import formBody				from '@fastify/formbody'
import fs					from 'fs'
import axios				from 'axios'
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
	timeout: 1000
});


/* ====================== SERVER ====================== */

export const	jwtFastify: FastifyInstance = Fastify({
	logger: true,
	trustProxy: true
});

jwtFastify.register(formBody);

jwtFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

jwtFastify.register(jwtController);

const	start = async () => {
	try {
		await jwtFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on http://jwt:3000`);

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
