/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 23:56:52 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT AUTH SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import axios from 'axios';
import https from 'https';
import argon2 from "argon2";

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';

import { authServ } 	from "../auth.js";

const auth = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	timeout: 1000
});

/* ====================== FUNCTIONS ====================== */

function	getCookies(request: FastifyRequest) {
	try {
		const cookies = Object.fromEntries(
			(request.headers.cookie || "")
			.split("; ")
			.map(c => c.split("="))
		)
		return cookies;
	} catch (err) {
		return ;
	}
}

async function isLoggedIn(cookie: string | undefined) {
	try {
		const res = await auth.get("https://jwt:3000/validate", { withCredentials: true, headers: { Cookie: cookie || "" } });
		return (res.status === 200);
	} catch (error: any) {
		if (error.response?.status === 401)
			return false;
		throw error;
	}
}

function errorsHandler(err: unknown) {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error)
			return err.response.data.error;
		return err.message;
	} else if (err instanceof Error)
		return err.message;
	return "Unknown error";
}

interface SignUpBody {
	username: string;
	email: string;
	password: string;
}

async function	signUp(request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply) {
	try {
		if (!request.body)
			throw new Error("The request is empty");

		if (await isLoggedIn(request.headers.cookie))
			throw new Error("You are already connected");
		
		const userRes = await auth.post('https://user:3000', request.body);
		const user = userRes.data;
		
		try {
			const jwtRes = await auth.post('https://jwt:3000', user, { withCredentials: true } );
			
			const hash = await argon2.hash(request.body.password);
			await authServ.addClient(user.id, hash);

			if (jwtRes.headers['set-cookie'])
				reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

			return reply.status(201).send({
				id: user.id,
				username: user.username
			});
		} catch (error) {
			await auth.delete(`https://user:3000/${user.id}`);
			throw error;
		}
	} catch (error) {
		const msgError = errorsHandler(error);
		console.error(msgError);
		return reply.code(400).send({ error: msgError });
	}
}

interface SignInBody {
	identifier: string;
	password: string;
}

async function	signIn(request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply) {
	try {
		if (!request.body)
			throw new Error("The request is empty");

		const { identifier, password } = request.body;

		if (await isLoggedIn(request.headers.cookie))
			throw new Error("You are already connected");
		
		const userRes = await auth.get(`https://user:3000/lookup/${identifier}`);
		const user = userRes.data;
		
		if (!user)
			throw new Error("Wrong password or username.");
		
		const pwdHash: string = await authServ.getPasswordByIdClient(user.id);
		
		const	pwdIsValid = await argon2.verify(pwdHash, password);
		if (!pwdIsValid)
			throw new Error("Wrong password or username.");
		
		const jwtRes = await auth.post('https://jwt:3000', user, { withCredentials: true } );
		
		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);
		
		return reply.status(201).send({
			id: user.id,
			username: user.username
		});
	} catch (error) {
		const msgError = errorsHandler(error);
		console.error(msgError);
		return reply.code(400).send({ error: msgError });
	}
}

async function	deleteClient(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { jwtAccess } = getCookies(request);

		if (!jwtAccess)
			throw new Error("You are not connected");
		
		const payload = await auth.get("https://jwt:3000/validate", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		const response = await auth.delete(`https://jwt:3000/${payload.data.id}`);

		if (response.headers['set-cookie'])
			reply.header('Set-Cookie', response.headers['set-cookie']);

		await auth.delete(`https://user:3000/${payload.data.id}`);

		await authServ.deleteClient(payload.data.id);
		
		return reply.status(204).send(payload.data.id);
	} catch (error) {
		const msgError = errorsHandler(error);
		console.error(msgError);
		return reply.code(400).send({ error: msgError });
	}
}

export async function	authController(authFastify: FastifyInstance) {
	authFastify.post<{ Body: SignUpBody }>('/sign-up', signUp);
	authFastify.post<{ Body: SignInBody }>('/sign-in', signIn);
	authFastify.delete('/me', deleteClient);
}
