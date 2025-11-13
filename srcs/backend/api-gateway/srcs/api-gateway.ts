/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api-gateway.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 19:22:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/13 17:30:50 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORT ====================== */

import Fastify from 'fastify';
import cors from '@fastify/cors'
import axios from 'axios';
import fs from 'fs';
import https from 'https';

/* ====================== SERVER ====================== */

const	fastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

// fastify.register(userController, { prefix: '/api/user' });

fastify.register(cors, {
	origin: 'https://nginx:443',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

fastify.get('/api/jwt', async (request, reply) => {
  try {
    const response = await axios.get('https://jwt:3000/jwt', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // utile si certificat auto-signé
    });
    reply.send(response.data);
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to reach user service' });
  }
});

fastify.get('/api/user', async (request, reply) => {
  try {
    const response = await axios.get('https://user:3000/', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // utile si certificat auto-signé
    });
    reply.send(response.data);
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to reach user service' });
  }
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
