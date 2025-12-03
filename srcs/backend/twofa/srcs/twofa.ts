/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofa.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:21 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/03 21:40:38 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import axios				from 'axios'
import cors					from '@fastify/cors'
import Fastify, { type FastifyInstance }				from 'fastify'
import fs					from 'fs'
import https				from 'https'
import sqlite3Pkg			from 'sqlite3'
import { twofaController }	from './controllers/twofaController.js'
import { twofaService }		from "./services/twofaService.js"
import { twofaRepository }	from "./repositories/twofaRepository.js"

/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/twofa.db';

const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	twofaServ: twofaService = new twofaService(new twofaRepository(db));


/* ====================== VARIABLES ====================== */

export const	emailName: string = process.env.EMAIL!;
export const	emailPass: string = process.env.APP_PASS_EMAIL!;


/* ====================== AXIOS VARIABLES ====================== */

export const	twofaAxios = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	timeout: 10000
});

/* ====================== SERVER ====================== */

export const	twofaFastify: FastifyInstance = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

twofaFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

twofaFastify.register(twofaController);

const	start = async () => {
	try {
		await twofaFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on https://twofa:3000');

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			twofaFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err: unknown) {
		twofaFastify.log.error(err);
		process.exit(1);
	}
};
start();
