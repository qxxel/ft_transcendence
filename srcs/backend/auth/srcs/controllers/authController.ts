/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 16:12:56 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT AUTH SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import axios from 'axios';
import https from 'https';

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';

import { authServ } 	from "../auth.js";

const auth = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }), // for certificat auto-signé
	// timeout: 1000,
});

/* ====================== FUNCTIONS ====================== */

interface SignUpBody {
	username: string;
	email: string;
	password: string;
}

async function	signUp(request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply) {
	if (!request.body)
		return reply.code(400).send({ error: "The request is empty" });
	try {
		// surement devoir faire un check si la personne est deja co avec c'est token dans le header
		const userRes = await auth.post('https://user:3000', request.body);
		
		try {
			const jwtRes = await auth.post('https://jwt:3000', userRes.data, { withCredentials: true } );
			
			await authServ.addClient(userRes.data.id, request.body.password);

			if (jwtRes.headers['set-cookie'])
				reply.header('Set-Cookie', jwtRes.headers['set-cookie']);
			
			return reply.status(201).send(jwtRes.data);
		} catch (error) {
			await auth.delete(`https://user:3000/${userRes.data.id}`);
			throw error;
		}
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		return reply.code(400).send(error instanceof Error ? error.message : error);
	}
}

interface SignInBody {
	identifier: string;
	password: string;
}

async function	signIn(request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply) {
	if (!request.body)
		return reply.code(400).send({ error: "The request is empty" });

	const { identifier, password } = request.body;
	
	try {
		// surement devoir faire un check si la personne est deja co avec c'est token dans le header
		// recup id
		const userRes = await auth.get(`https://user:3000/lookup/${identifier}`);
		
		// verify password
		const pwd = await authServ.getClient(userRes.data.id);
		if (password !== pwd)
			throw new Error("Wrong password or username.");

		// creer jwt
		const jwtRes = await auth.post('https://jwt:3000', userRes.data, { withCredentials: true } );
		
		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);
		
		return reply.status(201).send(jwtRes.data); // faut renvoyer quoi ?? userRes.data | jwtRes.data | autre ?
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		return reply.code(400).send(error instanceof Error ? error.message : error);
	}
}

export async function	authController(authFastify: FastifyInstance) {
	authFastify.post<{ Body: SignUpBody }>('/sign-up', signUp);
	authFastify.post<{ Body: SignInBody }>('/sign-in', signIn);
}
