/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 18:26:59 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT AUTH SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import axios from 'axios';
import https from 'https';

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';

import { authServ } 	from "../auth.js";

const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // utile si certificat auto-signé

/* ====================== FUNCTIONS ====================== */


async function	signUp(request: FastifyRequest, reply: FastifyReply) {
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
}

interface SignInBody {
	identifier: string;
	password: string;
}

async function	signIn(request: FastifyRequest<{ Body:SignInBody }>, reply: FastifyReply) {
	if (!request.body)
		reply.code(400).send("The request is empty");
	try {
		// surement devoir faire un check si la personne est deja co avec c'est token dans le header
		// recup id
		console.log(request.body.identifier);
		const response = await axios.get(`https://user:3000/lookup/${request.body.identifier}`, { httpsAgent }); // request.body.identifier
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
}

export async function	authController(authFastify: FastifyInstance) {

	authFastify.post('/sign-up', async (request, reply) => {
		return await signUp(request, reply);
	});

	authFastify.post<{ Body:SignInBody }>('/sign-in', async (request, reply) => {
		return await signIn(request, reply);
	});

	authFastify.get('/', async (request, reply) => {
		return { message: "Hello auth!" };
	});
}
