/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notif.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 19:53:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:49:43 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT LAUNCH THE FASTIFY SERVER FOR NOTIF SERVICE


/* ====================== IMPORTS ====================== */

import Fastify					from 'fastify'
import cors						from '@fastify/cors'
import formBody					from '@fastify/formbody'
import { notifController }		from './controllers/notifController.js'
import { NotificationManager }	from './utils/notificationManager.js'

import  type { FastifyInstance }	from 'fastify'


/* ====================== NOTIFS VARIABLE ====================== */

export const	notifManager: NotificationManager = new NotificationManager();


/* ====================== SERVER ====================== */

export const	notifFastify: FastifyInstance = Fastify({
	logger: true,
	trustProxy: true
});

notifFastify.register(formBody);

notifFastify.register(cors, {
	origin: 'https://localhost:8080',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

notifFastify.register(notifController);

const	start = async () => {
	try {
		await notifFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on http://jwt:3000`);

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			notifFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (error: unknown) {
		notifFastify.log.error(error);
		process.exit(1);
	}
};
start();
