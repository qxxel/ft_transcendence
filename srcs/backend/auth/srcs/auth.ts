/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/15 15:08:05 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import Fastify from 'fastify';
import cors from '@fastify/cors'
import fs from 'fs';
import axios from 'axios';
import https from 'https';

/* ====================== SERVER ====================== */

const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // utile si certificat auto-signé

const	fastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

fastify.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

fastify.post('/sign-up', async (request, reply) => {
	if (!request.body)
		reply.code(400).send("The request is empty");
	try {
		// surement devoir faire un check si la personne est deja co avec c'est token dans le header
		const response = await axios.post('https://jwt:3000/test', request.body, { httpsAgent });
		// creer jwt, bien pencer a catch les erreurs (suprimer le user si jwt erreur)
		await axios.get('https://jwt:3000', { httpsAgent } );
		return reply.status(201).send(response.data);
	} catch (error) {
		// delete user
		return reply.status(501).send(error);
	}
});

fastify.post('/sign-in', async (request, reply) => {
	if (!request.body)
		reply.code(400).send("The request is empty");
	try {
		// surement devoir faire un check si la personne est deja co avec c'est token dans le header
		// recup id
		const response = await axios.get('https://jwt:3000/test', { httpsAgent });
		// verify password
		// if (request.pwd !== password[id])
		// 		throw new Error("Wrong password or username.");
		// creer jwt
		await axios.get('https://jwt:3000', { httpsAgent });
		return reply.status(201).send(response.data);
	} catch (error) {
		return reply.status(501).send(error);
	}
});

fastify.get('/', async (request, reply) => {
	return { message: "Hello auth!" };
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on https://auth:3000');

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
