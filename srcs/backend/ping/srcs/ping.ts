/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ping.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/18 07:43:34 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR PING SERVICE


/* ====================== IMPORT ====================== */

import axios				from 'axios'
import sqlite3Pkg			from 'sqlite3'
import Fastify				from 'fastify'
import cron					from 'node-cron'
import cors					from '@fastify/cors'
import formBody				from '@fastify/formbody'
import { pingService }		from './services/pingService.js'
import { pingController }	from './controllers/pingController.js'
import { pingRepository }	from "./repositories/pingRepository.js"

import type { FastifyInstance }	from 'fastify'

/* ====================== AXIOS VARIABLES ====================== */

export const	pingAxios = axios.create({
	timeout: 5000
});


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/ping.db';

const	db: sqlite3Pkg.Database = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	pingServ = new pingService(new pingRepository(db));

cron.schedule("0 * * * * *", () => { // 1m
	console.log("Cron: Running cleanup...");
	pingServ.logoutInactiveClient();
	console.log("Cron: Cleanup done.");
});


/* ====================== SERVER ====================== */

export const	pingFastify: FastifyInstance = Fastify({
	logger: true,
	trustProxy: true
});

pingFastify.register(formBody);

pingFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

pingFastify.register(pingController);


const	start = async () => {
	try {
		await pingFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on http://ping:3000');

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			pingFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err: unknown) {
		pingFastify.log.error(err);
		process.exit(1);
	}
};
start();
