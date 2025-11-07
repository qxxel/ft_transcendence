/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 19:22:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/07 20:42:55 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORT ====================== */

import Fastify from 'fastify';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import cors from '@fastify/cors'
import { userService } from './tableServices/userService.js'
import { userRepository } from './tableRepositories/userRepository.js'
import userController from "./controllers/userController.js"


/* ====================== DATABASE ====================== */

const			dbname = '/app/dist/db/mydatabase.db';
export const	db = new sqlite3.Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	userServ = new userService(new userRepository(db));

export const	jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);


/* ====================== SERVER ====================== */

export const	fastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

fastify.register(userController, { prefix: '/api/user' });

fastify.register(cors, {
	origin: 'https://nginx:443',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://localhost:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			fastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
