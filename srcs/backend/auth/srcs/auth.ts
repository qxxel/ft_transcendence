/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/16 15:14:25 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import Fastify from 'fastify';
import cors from '@fastify/cors'
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import sqlite3Pkg from 'sqlite3';

import { authController }	from './controllers/authController.js';
import { authService }		from './services/authService.js';
import { authRepository }	from "./repositories/authRepository.js"

/* ====================== DATABASE ====================== */

const			{ Database } = sqlite3Pkg;
const			dbname = '/app/dist/db/auth.db';
export const	db = new Database(dbname, (err: Error | null) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});

export const	authServ = new authService(new authRepository(db));

/* ====================== SERVER ====================== */

const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // utile si certificat auto-signé

const	authFastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

authFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

authFastify.register(authController);

authFastify.post('/sign-up', async (request, reply) => {
	if (!request.body)
		reply.code(400).send("The request is empty");
	try {
		// surement devoir faire un check si la personne est deja co avec c'est token dans le header
		const response = await axios.post('https://user:3000', request.body, { httpsAgent });
		
		// creer jwt, bien pencer a catch les erreurs (suprimer le user si jwt erreur)
		const res = await axios.post('https://jwt:3000', response.data, { httpsAgent, withCredentials: true } )
			.catch( async (e) => {
				await axios.delete(`https://user:3000/${response.data.id}`, { httpsAgent });
				throw e;
			});
		
		if (res.headers['set-cookie'])
			reply.header('Set-Cookie', res.headers['set-cookie']);
		
		return reply.status(201).send(res.data);
	} catch (error) {
		// delete user
		return reply.status(501).send(error);
	}
});

interface SignInBody {
	identifier: string;
	password: string;
}

authFastify.post<{ Body:SignInBody }>('/sign-in', async (request, reply) => {
	if (!request.body)
		reply.code(400).send("The request is empty");
	try {
		// surement devoir faire un check si la personne est deja co avec c'est token dans le header
		// recup id
		const response = await axios.get(`https://user:3000/`, { httpsAgent }); // request.body.identifier
		// verify password
		// if (request.body.identifier !== password[response.data.user.id])
		// 		throw new Error("Wrong password or username.");
		// creer jwt
		const res = await axios.post('https://jwt:3000', response.data, { httpsAgent, withCredentials: true } );
		
		if (res.headers['set-cookie'])
			reply.header('Set-Cookie', res.headers['set-cookie']);
		
		return reply.status(201).send(response.data);
	} catch (error) {
		return reply.status(501).send(error);
	}
});

authFastify.get('/', async (request, reply) => {
	return { message: "Hello auth!" };
});

const start = async () => {
	try {
		await authFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on https://auth:3000');

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			authFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		authFastify.log.error(err);
		process.exit(1);
	}
};
start();
