/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:42:08 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE ALL REQUESTS AND DATABASE CONNECTIONS FOR THE USER SERVICE


/* ====================== IMPORT ====================== */

import axios		from 'axios'
import Fastify		from 'fastify'
import sqlite3Pkg	from 'sqlite3'
import cors			from '@fastify/cors'
import formBody		from '@fastify/formbody'
import multipart	from '@fastify/multipart'

import { usersService }				from "./services/usersService.js"
import { userStatsService }			from "./services/userStatsService.js"
import { friendshipsService }		from "./services/friendshipsService.js"
import { usersController }			from "./controllers/usersController.js"
import { usersRepository }			from "./repositories/usersRepository.js"
import { userStatsController }		from "./controllers/userStatsController.js"
import { userStatsRepository }		from "./repositories/userStatsRepository.js"
import { friendshipsController }	from "./controllers/friendshipsController.js"
import { friendshipsRepository }	from "./repositories/friendshipsRepository.js"


/* ====================== AXIOS VARIABLES ====================== */

export const	userAxios = axios.create({
	timeout: 5000
});


/* ====================== DATABASE ====================== */

const	{ Database } = sqlite3Pkg;
const	dbname: string = '/app/dist/db/user.db';
const	db: sqlite3Pkg.Database = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);
	else
	{
		db.run('PRAGMA foreign_keys = ON;', (pragmaerror) => {
			if (pragmaerror)
				console.error("Impossible to turn on Foreign Keys", pragmaerror);
		});
		console.log(`Database started on ${dbname}`);
	}
});

export const	usersServ: usersService = new usersService(new usersRepository(db));
export const	userStatsServ: userStatsService = new userStatsService(new userStatsRepository(db));
export const	friendshipsServ: friendshipsService = new friendshipsService(new friendshipsRepository(db));


/* ====================== SERVER ====================== */

const	userFastify: any = Fastify({
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
userFastify.register(userStatsController, { prefix: '/stats' } );
userFastify.register(friendshipsController, { prefix: '/friends' } );


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
	} catch (error: unknown) {
		userFastify.log.error(error);
		process.exit(1);
	}
};
start();
