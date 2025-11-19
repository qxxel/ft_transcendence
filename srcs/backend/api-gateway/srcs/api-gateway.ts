/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api-gateway.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 19:22:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:50:05 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR API GATEWAY SERVICE


/* ====================== IMPORT ====================== */

import axios	from 'axios'
import cors		from '@fastify/cors'
import Fastify, { type FastifyInstance }	from 'fastify'
import fs		from 'fs'
import https	from 'https'

import { gatewayAuthController }	from "./controllers/gatewayAuthController.js"
import { gatewayJwtController }		from "./controllers/gatewayJwtController.js"
import { gatewayUserController }	from "./controllers/gatewayUserController.js"


/* ====================== AXIOS VARIABLES ====================== */

export const	gatewayAxios = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	timeout: 1000
});


/* ====================== SERVER ====================== */

const	gatewayFastify: FastifyInstance = Fastify({
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


gatewayFastify.register(gatewayUserController, { prefix: '/api/user' });
gatewayFastify.register(gatewayJwtController, { prefix: '/api/jwt' });
gatewayFastify.register(gatewayAuthController, { prefix: '/api/auth' });

const	start = async () => {
	try {
		await gatewayFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://localhost:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			gatewayFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err: unknown) {
		gatewayFastify.log.error(err);
		process.exit(1);
	}
};
start();
