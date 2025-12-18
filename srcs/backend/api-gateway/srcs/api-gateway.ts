/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api-gateway.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 19:22:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 05:46:00 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR API GATEWAY SERVICE


/* ====================== IMPORT ====================== */

import axios						from 'axios'
import Fastify						from 'fastify'
import cors							from '@fastify/cors'
import formBody						from '@fastify/formbody'
import { gatewayAuthController }	from "./controllers/gatewayAuthController.js"
import { gatewayGameController }	from "./controllers/gatewayGameController.js"
import { gatewayJwtController }		from "./controllers/gatewayJwtController.js"
import { gatewayNotifController }	from "./controllers/gatewayNotifController.js"
import { gatewaytwofaController }	from "./controllers/gatewaytwofaController.js"
import { gatewayUserController }	from "./controllers/gatewayUserController.js"
import { gatewayPingController }	from "./controllers/gatewayPingController.js"
import { NotificationManager }		from './utils/notificationManager.js'
import proxy						from '@fastify/http-proxy'

import type { AxiosInstance }	from 'axios'
import type { FastifyInstance }	from 'fastify'

/* ====================== AXIOS VARIABLE ====================== */

export const	gatewayAxios: AxiosInstance = axios.create({
	timeout: 15000
});


/* ====================== NOTIFS VARIABLE ====================== */

export const	notifManager: NotificationManager = new NotificationManager();


/* ====================== SERVER ====================== */

const	gatewayFastify: FastifyInstance = Fastify({
	logger: true,
	trustProxy: true
});

gatewayFastify.register(formBody);

gatewayFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

gatewayFastify.register(proxy, {
	upstream: 'http://game:3000',
	prefix: '/socket.io',
	websocket: true,
	rewritePrefix: '/socket.io'
});

gatewayFastify.register(proxy, {
	upstream: 'http://user:3000',
	prefix: '/api/user/avatar',
	rewritePrefix: '/avatar',
	http2: false
});

gatewayFastify.register(gatewayAuthController, { prefix: '/api/auth' });
gatewayFastify.register(gatewayGameController, { prefix: '/api/game' });
gatewayFastify.register(gatewayJwtController, { prefix: '/api/jwt' });
gatewayFastify.register(gatewayNotifController, { prefix: '/api/notifications' });
gatewayFastify.register(gatewaytwofaController, { prefix: '/api/twofa' });
gatewayFastify.register(gatewayUserController, { prefix: '/api/user' });
gatewayFastify.register(gatewayPingController, { prefix: '/api/ping' });


const	start = async () => {
	try {
		await gatewayFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on http://gateway:3000`);

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
