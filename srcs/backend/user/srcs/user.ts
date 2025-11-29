/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/29 11:39:06 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import Fastify		from 'fastify'
import cors			from '@fastify/cors'
import fs			from 'fs'
import sqlite3Pkg from 'sqlite3'

import { friendshipsController }	from "./controllers/friendshipsController.js"
import { friendshipsService }		from "./services/friendshipsService.js"
import { friendshipsRepository }	from "./repositories/friendshipsRepository.js"
import { usersController }			from "./controllers/usersController.js"
import { usersService }				from "./services/usersService.js"
import { usersRepository }			from "./repositories/usersRepository.js"
import { userStatsController }		from "./controllers/userStatsController.js"
import { userStatsService }			from "./services/userStatsService.js"
import { userStatsRepository }		from "./repositories/userStatsRepository.js"

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
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});


userFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});


userFastify.register(usersController);
userFastify.register(userStatsController, { prefix: '/stats' } ); //	A VERIFIER SI C'EST A GARDER
userFastify.register(friendshipsController, { prefix: '/friends' } ); //	A VERIFIER SI C'EST A GARDER


const	start = async () => {
	try {
		await userFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://user:3000`);

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
