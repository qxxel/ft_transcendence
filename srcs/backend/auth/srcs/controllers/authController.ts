/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 03:09:38 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT AUTH SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import argon2			from 'argon2'
import axios			from 'axios'
import { authAxios } 	from "../auth.js"
import { authServ } 	from "../auth.js"

import type	{ AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== INTERFACES ====================== */

interface	SignUpBody {
	username: string;
	email: string;
	password: string;
};

interface	SignInBody {
	identifier: string;
	password: string;
}


/* ====================== FUNCTIONS ====================== */

function	getCookies(request: FastifyRequest): any {
	try {
		const	cookies: any = Object.fromEntries(
			(request.headers.cookie || "")
			.split("; ")
			.map(c => c.split("="))
		)
		return cookies;
	} catch (err: unknown) {
		return ;
	}
}

async function isLoggedIn(cookie: string | undefined): Promise<boolean> {
	try {
		const	res: AxiosResponse = await authAxios.get("https://jwt:3000/validate", { withCredentials: true, headers: { Cookie: cookie || "" } });

		return (res.status === 200);
	} catch (err: any) {
		if (err.response?.status === 401)
			return false;

		throw err;
	}
}

function errorsHandler(err: unknown): string {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error)
			return err.response.data.error;

		return err.message;
	}

	if (err instanceof Error)
		return err.message;

	return "Unknown error";
}

async function	signUp(request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new Error("The request is empty");

		if (await isLoggedIn(request.headers.cookie))
			throw new Error("You are already connected");

		const	userRes: AxiosResponse = await authAxios.post('https://user:3000', request.body);
		const	user: any = userRes.data;

		try {
			const	jwtRes: AxiosResponse = await authAxios.post('https://jwt:3000', user, { withCredentials: true } );

			const	hash: string = await argon2.hash(request.body.password);
			await authServ.addClient(user.id, hash);

			if (jwtRes.headers['set-cookie'])
				reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

			return reply.status(201).send({
				id: user.id,
				username: user.username
			});
		} catch (err: unknown) {
			await authAxios.delete(`https://user:3000/${user.id}`);

			throw err;
		}
	} catch (err: unknown) {
		const	msgError = errorsHandler(err);

		console.error(msgError);

		return reply.code(400).send({ error: msgError });
	}
}

async function	signIn(request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new Error("The request is empty");

		const	{ identifier, password } = request.body;

		if (await isLoggedIn(request.headers.cookie))
			throw new Error("You are already connected");

		const	userRes: AxiosResponse = await authAxios.get(`https://user:3000/lookup/${identifier}`);
		const	user: any = userRes.data;

		if (!user)
			throw new Error("Wrong password or username.");
		
		const	pwdHash: string = await authServ.getPasswordByIdClient(user.id);

		if (!await argon2.verify(pwdHash, password))
			throw new Error("Wrong password or username.");

		const	jwtRes: AxiosResponse = await authAxios.post('https://jwt:3000', user, { withCredentials: true } );
		
		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

		return reply.status(201).send({
			id: user.id,
			username: user.username
		});
	} catch (err: unknown) {
		const	msgError = errorsHandler(err);

		console.error(msgError);

		return reply.code(400).send({ error: msgError });
	}
}

async function	deleteClient(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	{ jwtAccess } = getCookies(request);

		if (!jwtAccess)
			throw new Error("You are not connected");

		const	payload: AxiosResponse = await authAxios.get("https://jwt:3000/validate", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		const	response: AxiosResponse = await authAxios.delete(`https://jwt:3000/${payload.data.id}`);

		if (response.headers['set-cookie'])
			reply.header('Set-Cookie', response.headers['set-cookie']);

		await authAxios.delete(`https://user:3000/${payload.data.id}`);

		await authServ.deleteClient(payload.data.id);
		
		return reply.status(204).send(payload.data.id);
	} catch (err: unknown) {
		const	msgError: string = errorsHandler(err);

		console.error(msgError);

		return reply.code(400).send({ error: msgError });
	}
}

export async function	authController(authFastify: FastifyInstance): Promise<void> {
	authFastify.post<{ Body: SignUpBody }>('/sign-up', signUp);
	authFastify.post<{ Body: SignInBody }>('/sign-in', signIn);
	authFastify.delete('/me', deleteClient);
}
