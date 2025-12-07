/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/07 15:33:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT AUTH SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import argon2								from 'argon2'
import { authAxios, authServ, authFastify }	from "../auth.js"
import { deleteClientExpires }				from "../services/authService.js"
import { errorsHandler }					from "../utils/errorsHandler.js"
import { isValidPassword }					from "../utils/validation.js"
import * as twofaError						from "../utils/throwErrors.js"

import type	{ AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { validationResult }								from "../utils/validation.js"


/* ====================== INTERFACES ====================== */

interface	SignUpBody {
	username: string;
	email: string;
	password: string;
};

interface	SignInBody {
	identifier: number;
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
		const	res: AxiosResponse = await authAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: cookie || "" } });

		return (res.status === 200);
	} catch (err: any) {
		if (err.response?.status === 401)
			return false;

		throw err;
	}
}

async function	signUp(request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new twofaError.RequestEmptyError("The request is empty");
		
		const	validation: validationResult = isValidPassword(request.body.password)
		if (!validation.result)
			throw new Error(validation.error);

		const	hash: string = await argon2.hash(request.body.password);
		
		if (await isLoggedIn(request.headers.cookie))
			throw new twofaError.AlreadyConnectedError("You are already connected");

		const	userRes: AxiosResponse = await authAxios.post('http://user:3000', request.body);
		const	user: any = userRes.data;

		try {
			const	jwtRes: AxiosResponse = await authAxios.post('http://jwt:3000/twofa', user);

			await authServ.addClient(user.id, hash);

			if (jwtRes.headers['set-cookie'])
				reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

			return reply.status(201).send({
				id: user.id,
				username: user.username
			});
		} catch (err: unknown) {
			await authAxios.delete(`http://user:3000/${user.id}`);

			throw err;
		}
	} catch (err: unknown) {
		return errorsHandler(authFastify, reply , err);
	}
}

async function	signIn(request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new twofaError.RequestEmptyError("The request is empty");

		const	{ identifier, password } = request.body;

		if (await isLoggedIn(request.headers.cookie))
			throw new twofaError.AlreadyConnectedError("You are already connected");

		const	userRes: AxiosResponse = await authAxios.get(`http://user:3000/lookup/${identifier}`);
		const	user: any = userRes.data;

		if (!user)
			throw new twofaError.WrongCredentialsError("Wrong password or username."); // mreynaud : a voir quand ce message est utilise car peut etre que le contenu est pas juste -> "Wrong password."

		const expires_at: number | undefined | null = await authServ.getExpiresByIdClient(user.id);
		if (expires_at !== null && expires_at !== undefined)
			throw new twofaError.WrongCredentialsError("Wrong password or username.");
		
		const	pwdHash: string = await authServ.getPasswordByIdClient(user.id);

		if (!await argon2.verify(pwdHash, password))
			throw new twofaError.WrongCredentialsError("Wrong password or username.");

		const	jwtRes: AxiosResponse = await authAxios.post('http://jwt:3000', user, { withCredentials: true } );
		
		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

		return reply.status(201).send({
			id: user.id,
			username: user.username,
			is2faEnable: user.is2faEnable
		});
	} catch (err: unknown) {
		return errorsHandler(authFastify, reply , err);
	}
}

async function	validateUser(request: FastifyRequest<{ Body: { otp: string } }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new Error("The request is empty");

		const	otp: string = request.body.otp;
		const	jwtRes: AxiosResponse = await authAxios.post('http://twofa:3000/validate', { otp }, { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } } );

		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

		const id: number = jwtRes.data;

		await authServ.updateExpiresByIdClient(id, null);

		return reply.status(201).send(id);
	} catch (err: unknown) {
		return errorsHandler(authFastify, reply , err);
	}
}

async function	deleteClient(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	{ jwtAccess } = getCookies(request);

		if (!jwtAccess)
			throw new Error("You are not connected");

		const	payload: AxiosResponse = await authAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		if (!payload.data.id)
			throw new Error("invalide id");

		await authAxios.delete(`http://user:3000/${payload.data.id}`);
		await authAxios.delete(`http://game:3000/user/${payload.data.id}`);

		const	response: AxiosResponse = await authAxios.delete("http://jwt:3000/me", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		if (response.headers['set-cookie'])
			reply.header('Set-Cookie', response.headers['set-cookie']);

		await authServ.deleteClient(payload.data.id);
		
		return reply.status(204).send(payload.data.id);
	} catch (err: unknown) {
		return errorsHandler(authFastify, reply , err);
	}
}

async function	deleteTwofaClient(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	{ jwtTwofa } = getCookies(request);
		if (!jwtTwofa)
			return reply.status(204).send();
		
		const	payload: AxiosResponse = await authAxios.get("http://jwt:3000/payload/twofa", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		deleteClientExpires(authServ, payload.data.id);
		
		const	response: AxiosResponse = await authAxios.delete("http://jwt:3000/me", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		if (response.headers['set-cookie'])
			reply.header('Set-Cookie', response.headers['set-cookie']);
		
		return reply.status(204).send(payload.data.id);	
	} catch (err: unknown) {
		return errorsHandler(authFastify, reply , err);
	}
}

async function	devValidate(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	jwtRes = await authAxios.post("http://jwt:3000/twofa/validate", request.body, { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

		const { id } = jwtRes.data;

		await authServ.updateExpiresByIdClient(id, null);

		return reply.status(201).send(id);
	} catch (err: unknown) {
		return errorsHandler(authFastify, reply , err);
	}
}

export async function	authController(authFastify: FastifyInstance): Promise<void> {
	authFastify.post<{ Body: SignUpBody }>('/sign-up', signUp);
	authFastify.post<{ Body: SignInBody }>('/sign-in', signIn);
	authFastify.post<{ Body: { otp: string } }>('/validateUser', validateUser);
	authFastify.delete('/me', deleteClient);
	authFastify.delete('/twofa/me', deleteTwofaClient);

	authFastify.post('/dev/validate', devValidate);
}
