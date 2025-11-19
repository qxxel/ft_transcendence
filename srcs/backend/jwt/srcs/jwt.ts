/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:26:37 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR JWT SERVICE


/* ====================== IMPORTS ====================== */

import cors					from '@fastify/cors'
import Fastify, { type FastifyInstance }				from 'fastify'
import fs					from 'fs'
import sqlite3Pkg			from 'sqlite3'
import { jwtController }	from "./controllers/jwtController.js"
import { jwtService }		from "./services/jwtService.js"
import { jwtRepository }	from "./repositories/jwtRepository.js"


/* ====================== TOKENS VARIABLES ====================== */

export const	expAccess: string = "1000s";
export const	expRefresh: string = "10000s";

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


/* ====================== SERVER ====================== */

const	jwtFastify: FastifyInstance = Fastify({
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
