/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/18 18:59:30 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR JWT SERVICE


/* ====================== IMPORTS ====================== */

import axios				from 'axios'
import Fastify				from 'fastify'
import sqlite3Pkg			from 'sqlite3'
import cron					from "node-cron";
import cors					from '@fastify/cors'
import formBody				from '@fastify/formbody'
import { jwtService }		from "./services/jwtService.js"
import { jwtController }	from "./controllers/jwtController.js"
import { jwtRepository }	from "./repositories/jwtRepository.js"

import  type { FastifyInstance }	from 'fastify'

/* ====================== TOKENS VARIABLES ====================== */


/* =================== CONVERTIONS =================== /*

	86400s	= 1day
	900s	= 15min
	300s	= 5min

/* ====================================================== */

export const	expRefresh: string = "86400s";
export const	expAccess: string = "900s";
export const	expTwofa: string = "300s";

export const	jwtSecret: Uint8Array<ArrayBuffer> = new TextEncoder().encode(process.env.JWT_SECRET);


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/jwt.db';

const	db: sqlite3Pkg.Database = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	jwtServ: jwtService = new jwtService(new jwtRepository(db));

cron.schedule("0 */10 * * * *", () => {
	console.log("Cron: Running cleanup...");
	jwtServ.cleanup();
	console.log("Cron: Cleanup done.");
});


/* ====================== AXIOS VARIABLES ====================== */

export const	jwtAxios = axios.create({
	timeout: 5000
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
