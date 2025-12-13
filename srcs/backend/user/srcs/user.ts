/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/13 01:09:16 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import axios		from 'axios'
import cors			from '@fastify/cors'
import Fastify		from 'fastify'
import formBody		from '@fastify/formbody'
import multipart	from '@fastify/multipart'
import sqlite3Pkg	from 'sqlite3'

import { friendshipsController }	from "./controllers/friendshipsController.js"
import { friendshipsService }		from "./services/friendshipsService.js"
import { friendshipsRepository }	from "./repositories/friendshipsRepository.js"
import { usersController }			from "./controllers/usersController.js"
import { usersService }				from "./services/usersService.js"
import { usersRepository }			from "./repositories/usersRepository.js"
import { userStatsController }		from "./controllers/userStatsController.js"
import { userStatsService }			from "./services/userStatsService.js"
import { userStatsRepository }		from "./repositories/userStatsRepository.js"


/* ====================== AXIOS VARIABLES ====================== */

export const	userAxios = axios.create({
	timeout: 5000
});


/* ====================== DATABASE ====================== */

const			{ Database } = sqlite3Pkg;
const			dbname = '/app/dist/db/user.db';
const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);
	else
	{
		db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
			if (pragmaErr)
				console.error("Impossible to turn on Foreign Keys", pragmaErr);
		});
		console.log(`Database started on ${dbname}`);
	}
});

export const	usersServ = new usersService(new usersRepository(db));
export const	userStatsServ = new userStatsService(new userStatsRepository(db));
export const	friendshipsServ = new friendshipsService(new friendshipsRepository(db));


/* ====================== SERVER ====================== */

const	userFastify = Fastify({
	logger: true,
	trustProxy: true
});

userFastify.register(multipart, {
	limits: {
		fileSize: 5 * 1024 * 1024,
	}
});

userFastify.register(formBody);

userFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});


userFastify.register(usersController);
userFastify.register(userStatsController, { prefix: '/stats' } ); //	A VERIFIER SI C'EST A GARDER
userFastify.register(friendshipsController, { prefix: '/friends' } ); //	A VERIFIER SI C'EST A GARDER


const	start = async () => {
	try {
		await userFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on http://user:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			userFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		userFastify.log.error(err);
		process.exit(1);
	}
};
start();
