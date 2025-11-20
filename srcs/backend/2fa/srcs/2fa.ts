/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   2fa.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:21 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/20 02:17:08 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import axios				from 'axios'
import cors					from '@fastify/cors'
import Fastify, { type FastifyInstance }				from 'fastify'
import fs					from 'fs'
import https				from 'https'
import { twofaController }	from './controllers/2faController.js'

/* ====================== VARIABLES ====================== */

export const	mailgunApiKey = process.env.MAILGUN_API_KEY;

/* ====================== AXIOS VARIABLES ====================== */

export const	twofaAxios = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	timeout: 1000
});

/* ====================== SERVER ====================== */

const	twofaFastify: FastifyInstance = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

twofaFastify.register(cors, {
	origin: 'https://gateway:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});

twofaFastify.register(twofaController);

const	start = async () => {
	try {
		await twofaFastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server started on https://2fa:3000');

		process.on('SIGTERM', () => {
			console.log('SIGTERM received, server shutdown...');
			twofaFastify.server.close(() => {
				process.exit(0);
			});
		});
	} catch (err: unknown) {
		twofaFastify.log.error(err);
		process.exit(1);
	}
};
start();
