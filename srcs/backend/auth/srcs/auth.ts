/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/19 02:38:15 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR AUTH SERVICE


/* ====================== IMPORT ====================== */

import axios				from 'axios'
import cors					from '@fastify/cors'
import Fastify				from 'fastify'
import fs					from 'fs'
import https				from 'https'
import sqlite3Pkg			from 'sqlite3'
import { authController }	from './controllers/authController.js'
import { authRepository }	from "./repositories/authRepository.js"
import { authService }		from './services/authService.js'


/* ====================== AXIOS VARIABLES ====================== */

export const	authAxios = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	timeout: 1000
});


/* ====================== DATABASE ====================== */

const			{ Database } = sqlite3Pkg;
const			dbname = '/app/dist/db/auth.db';
const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	authServ = new authService(new authRepository(db));

/* ====================== SERVER ====================== */

const	authFastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

authFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

authFastify.register(authController);

const	start = async () => {
	try {
		await authFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on https://auth:3000');

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			authFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		authFastify.log.error(err);
		process.exit(1);
	}
};
start();
