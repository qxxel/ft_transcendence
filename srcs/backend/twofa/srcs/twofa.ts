/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofa.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:21 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/03 17:42:34 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import axios				from 'axios'
import cors					from '@fastify/cors'
import Fastify				from 'fastify'
import formBody				from '@fastify/formbody'
import sqlite3Pkg			from 'sqlite3'
import { twofaController }	from './controllers/twofaController.js'
import { twofaService }		from "./services/twofaService.js"
import { twofaRepository }	from "./repositories/twofaRepository.js"

import type { FastifyInstance }	from 'fastify'


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
	timeout: 10000
});

/* ====================== SERVER ====================== */

const	twofaFastify: FastifyInstance = Fastify({
	logger: true
});

twofaFastify.register(formBody);

twofaFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

twofaFastify.register(twofaController);

const	start = async () => {
	try {
		await twofaFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on http://twofa:3000');

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
