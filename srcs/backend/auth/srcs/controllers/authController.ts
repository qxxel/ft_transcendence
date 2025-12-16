/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 23:29:08 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT AUTH SERVICE RECEIVE


/* ====================== IMPORTS ====================== */

import argon2								from 'argon2'
import { authAxios, authServ, authFastify }	from "../auth.js"
import { isLoggedIn }						from "../utils/isLog.js"
import { getCookies }						from "../utils/cookies.js"
import { isValidPassword }					from "../utils/validation.js"
import * as authError						from "../utils/throwErrors.js"
import { errorsHandler }					from "../utils/errorsHandler.js"

import type	{ AxiosResponse }								from 'axios'
import type { FastifyInstance, FastifyRequest }				from 'fastify'
import type { FastifyReply }								from 'fastify'
import type { SignUpBody, SignInBody, user }				from "../dtos/interface.js"
import type { updateUserBody, usersRespDto }				from "../dtos/interface.js"
import type { validationResult }							from "../utils/validation.js"


/* ====================== FUNCTIONS ====================== */

async function	signUp(request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new authError.RequestEmptyError("The request is empty");
		
		const	validation: validationResult = isValidPassword(request.body.password)
		if (!validation.result)
			throw new authError.InvalidSyntaxError(validation.error);

		const	hash: string = await argon2.hash(request.body.password);
		
		if (await isLoggedIn(request.headers.cookie))
			throw new authError.AlreadyConnectedError("You are already connected!");

		const	userRes: AxiosResponse = await authAxios.post('http://user:3000', request.body);
		
		if (!userRes || !userRes.data)
			throw new authError.MissingIdError("Id of the user is missing!");
		
		const	user: usersRespDto = userRes.data;

		if (!user || !user.id)
			throw new authError.MissingIdError("Id of the user is missing!");

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
		return await errorsHandler(authFastify, reply , err);
	}
}

async function	signIn(request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new authError.RequestEmptyError("The request is empty");
		
		const	identifier: number = request.body.identifier;
		const	password: string = request.body.password;
		
		if (!identifier || !password)
			throw new authError.RequestEmptyError("The request is empty");

		if (await isLoggedIn(request.headers.cookie))
			throw new authError.AlreadyConnectedError("You are already connected!");

		let	user: usersRespDto;
		try {
			const	userRes: AxiosResponse = await authAxios.get(`http://user:3000/lookup/${identifier}`);
			user = userRes.data;
		} catch (error) {
			throw new authError.WrongCredentialsError("Wrong password or username!");
		}

		if (!user || !user.id)
			throw new authError.WrongCredentialsError("Wrong password or username!");

		const	expires_at: number | null = await authServ.getExpiresByIdClient(user.id);
		if (expires_at !== null)
			throw new authError.WrongCredentialsError("Wrong password or username!");
		
		const	pwdHash: string | null = await authServ.getPasswordByIdClient(user.id);

		if (!pwdHash || !await argon2.verify(pwdHash, password))
			throw new authError.WrongCredentialsError("Wrong password or username!");

		const	jwtRes: AxiosResponse = await authAxios.post('http://jwt:3000', user, { withCredentials: true } );
		
		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

		return reply.status(201).send({
			id: user.id,
			username: user.username,
			email: user.email,
			is2faEnable: user.is2faEnable
		});
	} catch (err: unknown) {
		return await errorsHandler(authFastify, reply , err);
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

		const	id: number = jwtRes.data;

		if (!id)
			throw new authError.MissingIdError("Id of the user is missing!");

		await authServ.updateExpiresByIdClient(id, null);
		await authAxios.post('http://user:3000/log', { isLog: true }, { headers: { 'user-id': id } } );

		return reply.status(201).send(id);
	} catch (err: unknown) {
		return await errorsHandler(authFastify, reply , err);
	}
}

async function	validateAndDeleteClient(request: FastifyRequest<{ Body: { password: string } }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new Error("The request is empty");

		const	password: string = request.body.password;

		const	cookies: Record<string, string> = getCookies(request.headers.cookie);

		if (!cookies || !cookies.jwtAccess)
			throw new Error("You are not connected");
		
		const	payload: AxiosResponse = await authAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		if (!payload.data.id)
			throw new Error("invalide id");
		
		const	pwdHash: string | null = await authServ.getPasswordByIdClient(payload.data.id);
		if (!pwdHash || !await argon2.verify(pwdHash, password))
			throw new authError.WrongCredentialsError("Wrong password!");

		await deleteClient(request, reply);

		return reply.status(201).send(payload.data.id);
	} catch (err: unknown) {
		return await errorsHandler(authFastify, reply , err);
	}
}

async function	updateUser(request: FastifyRequest<{ Body: updateUserBody}>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new Error("The request is empty");
		
		const	password: string = request.body.password;
		const	otp: string | undefined = request.body.otp;
		const	user: user = request.body.user;

		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		
		if (!cookies || !cookies.jwtAccess)
			throw new Error("You are not connected");
		
		const	payload: AxiosResponse = await authAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		if (!payload.data.id)
			throw new Error("invalide id");
		
		const	pwdHash: string | null = await authServ.getPasswordByIdClient(payload.data.id);
		if (!pwdHash || !await argon2.verify(pwdHash, password))
			throw new authError.WrongCredentialsError("Wrong password!");

		const	oldUserRes: AxiosResponse = await authAxios.get(`http://user:3000/me`, {headers: { 'user-id': payload.data.id }});
		if (user.email && oldUserRes.data.email !== user.email) {
			if (otp == undefined)
				throw new authError.WrongCredentialsError("Wrong password!");
			await authAxios.post('http://twofa:3000/validate', { otp }, { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } } );
		}
			
		const	userRes: AxiosResponse = await authAxios.patch(`http://user:3000/me`, user, {headers: { 'user-id': payload.data.id }});
		const	jwtRes: AxiosResponse= await authAxios.patch(`http://jwt:3000/refresh`, {}, { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);
		
		return reply.status(201).send(userRes.data);
	} catch (err: unknown) {
		return await errorsHandler(authFastify, reply , err);
	}
}

async function	deleteClient(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies || !cookies.jwtAccess)
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
		return await errorsHandler(authFastify, reply , err);
	}
}

async function	deleteTwofaClient(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	cookies: Record<string, string> = getCookies(request.headers.cookie);
		if (!cookies || !cookies.jwtTwofa)
			return reply.status(204).send();
		
		const	payload: AxiosResponse = await authAxios.get("http://jwt:3000/payload/twofa", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		if (!payload.data.id)
			throw new Error("invalide id");
		
		if (await authServ.getExpiresByIdClient(payload.data.id)) {
			await authAxios.delete(`http://user:3000/${payload.data.id}`);
			await authAxios.delete(`http://game:3000/user/${payload.data.id}`);
			await authServ.deleteClient(payload.data.id);
		}

		const	response: AxiosResponse = await authAxios.delete("http://jwt:3000/me", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		if (response.headers['set-cookie'])
			reply.header('Set-Cookie', response.headers['set-cookie']);
		
		return reply.status(204).send(payload.data.id);	
	} catch (err: unknown) {
		return await errorsHandler(authFastify, reply , err);
	}
}

async function	devValidate(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	jwtRes = await authAxios.post("http://jwt:3000/twofa/validate", request.body, { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		if (jwtRes.headers['set-cookie'])
			reply.header('Set-Cookie', jwtRes.headers['set-cookie']);

		const	{ id } = jwtRes.data;

		await authServ.updateExpiresByIdClient(id, null);
		await authAxios.post('http://user:3000/log', { isLog: true }, { headers: { 'user-id': id } } );

		return reply.status(201).send(id);
	} catch (err: unknown) {
		return await errorsHandler(authFastify, reply , err);
	}
}

export async function	authController(authFastify: FastifyInstance): Promise<void> {
	authFastify.post<{ Body: SignUpBody }>('/sign-up', signUp);
	authFastify.post<{ Body: SignInBody }>('/sign-in', signIn);
	authFastify.post<{ Body: { otp: string } }>('/validateUser', validateUser);
	authFastify.post<{ Body: { password: string } }>('/delete/me', validateAndDeleteClient);

	authFastify.patch<{ Body: updateUserBody }>('/updateUser', updateUser);

	authFastify.delete('/me', deleteClient);
	authFastify.delete('/twofa/me', deleteTwofaClient);

	authFastify.post('/dev/validate', devValidate);
}
