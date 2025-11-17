/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/17 17:33:47 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR JWT SERVICE


/* ====================== IMPORT ====================== */

import Fastify		from 'fastify';
import cors			from '@fastify/cors'
import fs			from 'fs';
import sqlite3Pkg	from 'sqlite3';

import { jwtController }	from './controllers/jwtController.js';
import { jwtService }		from './services/jwtService.js';
import { jwtRepository }	from './repositories/jwtRepository.js';


/* ====================== TOKENS VARIABLES ====================== */

export const	expAccess = "10s";
export const	expRefresh = "1m";

export const	jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);


/* ====================== DATABASE ====================== */

const			{ Database } = sqlite3Pkg;
const			dbname = '/app/dist/db/jwt.db';
const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	jwtServ = new jwtService(new jwtRepository(db));


/* ====================== SERVER ====================== */

const	jwtFastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

jwtFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

jwtFastify.register(jwtController);

const start = async () => {
	try {
		await jwtFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://jwt:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			jwtFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		jwtFastify.log.error(err);
		process.exit(1);
	}
};
start();