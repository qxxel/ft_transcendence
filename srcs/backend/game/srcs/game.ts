/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:52:50 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 00:07:20 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR GAME SERVICE


/* ====================== IMPORTS ====================== */

import axios				from 'axios'
import Fastify				from 'fastify'
import sqlite3Pkg			from 'sqlite3'
import { Server }			from 'socket.io'
import cors					from '@fastify/cors'
import formBody				from '@fastify/formbody'
import { gamesController }	from "./controllers/gamesController.js"
import { GamesService }		from "./services/gamesService.js"
import { gamesRepository }	from "./repositories/gamesRepository.js"
import { setupPongSocket }	from "./socket/pongSocket.js"

import type { AxiosResponse }	from 'axios'
import type { FastifyInstance }	from 'fastify'


/* ====================== AXIOS VARIABLES ====================== */

export const	gameAxios: any = axios.create({
	timeout: 5000
});


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/game.db';

const	db: sqlite3Pkg.Database = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	gamesServ: GamesService = new GamesService(new gamesRepository(db));


/* ====================== SERVER ====================== */

const	gameFastify: FastifyInstance = Fastify({
	logger: true,
	trustProxy: true
});

gameFastify.register(formBody);

gameFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

gameFastify.register(gamesController, { prefix: '/' });

const	io: any = new Server(gameFastify.server, {
	path: '/socket.io',
	cors: {
		origin: "https://localhost:8080",
		methods: ["GET", "POST"],
		credentials: true
	}
});

io.use(async (socket: any, next: any) => {
	try {
		const	cookieHeader: string | undefined = socket.request.headers.cookie;
		console.log("cookies: " + cookieHeader);
		if (!cookieHeader)
			throw new Error();


		const	response: AxiosResponse = await gameAxios.get('http://jwt:3000/payload/access', 
			{ withCredentials: true, headers: { Cookie: cookieHeader || "" } }
		);

		console.log("resp: " + response.data);

		socket.data.user = response.data;

		console.log("user: " + socket.data.user);

		return next();
	} catch (err: unknown) {
		socket.data.user = null;
		return next();
	}
});

io.on('connection', (socket: any) => {
	console.log(`New socket connexion: ${socket.id}`);

	setupPongSocket(io, socket, gamesServ);
});

const	start = async () => {
	try {
		// Listen
		await gameFastify.listen({ port: 3000, host: '0.0.0.0' });
		gameFastify.log.info("Server started on http://game:3000");
		console.log("Server started on http://game:3000");

		// SIGTERM
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
