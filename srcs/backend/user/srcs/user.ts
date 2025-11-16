/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/16 00:19:28 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import Fastify		from 'fastify';
import cors			from '@fastify/cors'
import fs			from 'fs';
import sqlite3Pkg from 'sqlite3';

import { userController }	from "./controllers/userController.js"
import { userService }		from './services/userService.js';
import { userRepository }	from './repositories/userRepository.js';

/* ====================== DATABASE ====================== */

const			{ Database } = sqlite3Pkg;
const			dbname = '/app/dist/db/user.db';
export const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	userServ = new userService(new userRepository(db));


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


userFastify.register(userController);

userFastify.get('/', async (request, reply) => {	//
	return { message: "Hello User!" };				// A ENLEVER (TEST CONNECTION)
});													//

const start = async () => {
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
