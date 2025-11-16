/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api-gateway.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 19:22:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 18:18:19 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORT ====================== */

import Fastify from 'fastify';
import cors from '@fastify/cors'
import axios from 'axios';
import fs from 'fs';
import https from 'https';

import { requestErrorsHandler }	from "./utils/requestErrors.js"
import { gatewayController }	from "./controllers/userController.js"

/* ====================== SERVER ====================== */

const	gatewayFastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});


gatewayFastify.register(cors, {
	origin: 'https://nginx:443',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // utile si certificat auto-signé

gatewayFastify.register(gatewayController, { prefix: '/api/user', httpsAgent: httpsAgent });

gatewayFastify.get('/api/auth', async (request, reply) => {
	try {
	const response = await axios.get('https://auth:3000', { httpsAgent });
	reply.send(response.data);
	} catch (err) {
	gatewayFastify.log.error(err);
	reply.status(500).send({ error: 'Failed to reach auth service' });
	}
});

gatewayFastify.post('/api/auth/sign-up', async (request, reply) => {
	try {
	const response = await axios.post('https://auth:3000/sign-up', request.body, { httpsAgent });
	
	if (response.headers['set-cookie'])
		reply.header('Set-Cookie', response.headers['set-cookie']);
	
	reply.send(response.data);
	} catch (err) {
	gatewayFastify.log.error(err);
	reply.status(500).send({ error: 'Failed to reach auth service' });
	}
});

gatewayFastify.post('/api/auth/sign-in', async (request, reply) => {
	try {
	const response = await axios.post('https://auth:3000/sign-in', request.body, { httpsAgent, withCredentials: true });
	
	if (response.headers['set-cookie'])
			reply.header('Set-Cookie', response.headers['set-cookie']);

	reply.send(response.data);
	} catch (err) {
	gatewayFastify.log.error(err);
	reply.status(500).send({ error: 'Failed to reach auth service' });
	}
});



gatewayFastify.post('/api/jwt', async (request, reply) => {
	try {
		const response = await axios.post('https://jwt:3000', request.body, { httpsAgent });

		if (response.headers['set-cookie'])
			reply.header('Set-Cookie', response.headers['set-cookie']);

		console.log(response.headers['set-cookie']);
		// const setCookies = response.headers['set-cookie'];
		// if (setCookies){
		// 	setCookies.forEach(cookie => reply.header('Set-Cookie', cookie));
		// 	console.log(setCookies);
		// }

		reply.send(response.data);
	} catch (err) {
		return requestErrorsHandler(gatewayFastify, reply, err);
		// gatewayFastify.log.error(err);
		// console.log((err as any).message);
		// console.log(err);

		// reply.status(500).send({ error: 'Failed to reach auth service' });
	}
});

gatewayFastify.post('/api/jwt/validate', async (request, reply) => {
	try {
		console.log("cookies:" + request.headers.cookie);
		const response = await axios.get('https://jwt:3000/validate', { httpsAgent, withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		reply.send(response.data);
	} catch (err) {
		gatewayFastify.log.error(err);

		reply.status(500).send({ error: 'Failed to reach auth service' });
	}
});

// gatewayFastify.post('/api/jwt/refresh', async (request, reply) => {
//   try {
// 	const response = await axios.get('https://jwt:3000/refresh', { httpsAgent });
//     reply.send(response.data);
//   } catch (err) {
//     gatewayFastify.log.error(err);
//     reply.status(500).send({ error: 'Failed to reach auth service' });
//   }
// });



const start = async () => {
	try {
		await gatewayFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://localhost:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			gatewayFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err) {
		gatewayFastify.log.error(err);
		process.exit(1);
	}
};
start();
