/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 19:22:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/30 18:16:03 by agerbaud         ###   ########.fr       */
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

export const	userRepo = new userRepository(db);
export const	userServ = new userService(userRepo);



/* ====================== SERVER ====================== */

export const	fastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

fastify.register(userController, { prefix: '/api/user' });

// fastify.get('/', async (request, reply) => {
// 	return ( { message: "Hello world" })
// });

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://localhost:3000`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
