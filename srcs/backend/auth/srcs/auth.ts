/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/07 14:10:11 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR AUTH SERVICE


/* ====================== IMPORT ====================== */

import axios				from 'axios'
import cors					from '@fastify/cors'
import Fastify, { type FastifyInstance }				from 'fastify'
import formBody				from '@fastify/formbody'
import fs					from 'fs'
import sqlite3Pkg			from 'sqlite3'
import { authController }	from './controllers/authController.js'
import { authRepository }	from "./repositories/authRepository.js"
import { authService }		from './services/authService.js'


/* ====================== AXIOS VARIABLES ====================== */

export const	authAxios = axios.create({
	timeout: 1000
});


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname = '/app/dist/db/auth.db';

const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	authServ = new authService(new authRepository(db));

/* ====================== SERVER ====================== */

export const	authFastify: FastifyInstance = Fastify({
	logger: true,
	trustProxy: true
});

authFastify.register(formBody);

authFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

authFastify.register(authController);

authFastify.addHook('onReady', async () => {
	console.log("Running cleanup...");
	await authServ.cleanup();
	console.log("Cleanup done.");
});

const	start = async () => {
	try {
		await authFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on http://auth:3000');

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			authFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err: unknown) {
		authFastify.log.error(err);
		process.exit(1);
	}
};
start();
