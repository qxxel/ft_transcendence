/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:52:50 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 22:34:53 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR GAME SERVICE


/* ====================== IMPORTS ====================== */

import axios, { isAxiosError, type AxiosResponse }				from 'axios'
import cors					from '@fastify/cors'
import Fastify				from 'fastify'
import formBody				from '@fastify/formbody'
import fs					from 'fs'
import { Server }			from 'socket.io'
import sqlite3Pkg			from 'sqlite3'
import { pongController }	from "./controllers/pongController.js"
import { PongService }		from "./services/pongService.js"
import { pongRepository }	from "./repositories/pongRepository.js"
import { setupPongSocket }	from "./socket/pongSocket.js"
import { tankController }	from "./controllers/tankController.js"
import { tankService }		from "./services/tankService.js"
import { tankRepository }	from "./repositories/tankRepository.js"

import type { FastifyInstance }	from 'fastify'


/* ====================== AXIOS VARIABLES ====================== */

export const	gameAxios = axios.create({
	timeout: 1000
});


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/game.db';

const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	pongServ: PongService = new PongService(new pongRepository(db));
export const	tankServ: tankService = new tankService(new tankRepository(db));


/* ====================== SERVER ====================== */

const	gameFastify: FastifyInstance = Fastify({
	logger: true,
	trustProxy: true
});

gameFastify.register(formBody);

gameFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

gameFastify.register(pongController, { prefix: '/pong' });
gameFastify.register(tankController, { prefix: '/tank' });

const	io = new Server(gameFastify.server, {
	path: '/socket.io',
	cors: {
		origin: "https://localhost:8080",
		methods: ["GET", "POST"],
		credentials: true
	}
});

io.use(async (socket, next) => {
	try {
		const	cookieHeader: string | undefined = socket.request.headers.cookie;
		console.log("cookies: " + cookieHeader);
		if (!cookieHeader)
			throw new Error();


		const	response: AxiosResponse = await gameAxios.get('http://jwt:3000/validate', 
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

io.on('connection', (socket) => {
	console.log(`[Main] Nouvelle connexion Socket : ${socket.id}`);

	setupPongSocket(io, socket, pongServ);
});

const	start = async () => {
	try {
		// Listen
		await gameFastify.listen({ port: 3000, host: '0.0.0.0' });
		gameFastify.log.info("Server started on http://game:3000");
		console.log("Server started on http://game:3000");

		// Socket.io
		// const io = new Server(gameFastify.server, {
		// 	path: "/socket.io",
		// 	cors: {
		// 		origin: "https://frontend:443", 
		// 		methods: ["GET", "POST"]
		// 	}
		// });

		// io.on("connection", (socket) => {
		// 	gameFastify.log.info(`Joueur connecté au Game Service : ${socket.id}`);

		// 	socket.on("disconnect", () => {
		// 		gameFastify.log.info(`Joueur déconnecté : ${socket.id}`);
		// 		console.log(`Joueur déconnecté : ${socket.id}`);
		// 	});

		// 	socket.on("ping", () => {
		// 		socket.emit("pong", "Hello from Fastify Game Service");
		// 	});
		// });

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
