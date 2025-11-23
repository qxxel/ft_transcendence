/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:52:50 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 21:51:28 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR GAME SERVICE


/* ====================== IMPORTS ====================== */

import cors					from '@fastify/cors'
import Fastify				from 'fastify'
import fs					from 'fs'
import sqlite3Pkg			from 'sqlite3'
import { pongController }	from "./controllers/pongController.js"
import { pongService }		from "./services/pongService.js"
import { pongRepository }	from "./repositories/pongRepository.js"
import { tankController }	from "./controllers/tankController.js"
import { tankService }		from "./services/tankService.js"
import { tankRepository }	from "./repositories/tankRepository.js"

import type { FastifyInstance }	from 'fastify'


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/game.db';

const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	pongServ: pongService = new pongService(new pongRepository(db));
export const	tankServ: tankService = new tankService(new tankRepository(db));


/* ====================== SERVER ====================== */

const	gameFastify: FastifyInstance = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

gameFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

gameFastify.get('/', (request, reply) => {						//
	return reply.code(200).send({ message: "Hello World !" });	//	/!\ TEST: HAVE TO REMOVE /!\
});																//

gameFastify.register(pongController, { prefix: '/pong' });
gameFastify.register(tankController, { prefix: '/tank' });

const	start = async () => {
	try {
		await gameFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://game:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			gameFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err: unknown) {
		gameFastify.log.error(err);
		process.exit(1);
	}
};
start();
