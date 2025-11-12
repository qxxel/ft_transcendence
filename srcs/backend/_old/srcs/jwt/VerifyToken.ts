/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   VerifyToken.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:34:09 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/10 15:02:59 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import { FastifyRequest, FastifyReply } from 'fastify';
import { userServ, jwtSecret } from "../index.js";
import { userDto } from "../dtos/userDto.js";
const jose = require("jose");

const expAccess = "10s";
const expRefresh = "1m";

/* ====================== FUNCTIONS ====================== */

async function	jwtGenerate(user: userDto, exp: string): Promise<string> {
	return await new jose.SignJWT( {
			'id': user.getId(),
			'username': user.getName(),
			'email': user.getEmail()
		})
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setIssuedAt()
		.setExpirationTime(exp)
		.sign(jwtSecret);
}

function	getCookies(request: FastifyRequest) {
	const cookies = Object.fromEntries(
		(request.headers.cookie || "")
		.split("; ")
		.map(c => c.split("="))
	)
	return cookies
}

// hostOnly ???
function	setCookiesAccessToken(reply: FastifyReply, jwtAccess: string) {
	reply.header(
		"Set-Cookie",
		`jwtAccess=${jwtAccess}; SameSite=strict; HttpOnly; secure; Max-Age=10; path=/api/user/auth`
	);
}

function	setCookiesAccessRefresh(reply: FastifyReply, jwtRefresh: string) {
	reply.header(
		"Set-Cookie",
		`jwtRefresh=${jwtRefresh}; SameSite=strict; HttpOnly; secure; Max-Age=60; path=/api/user/auth`
	);
}

function	removeCookies(reply: FastifyReply, key: string) {
	reply.header(
		"Set-Cookie",
		`${key}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
	);
}

export async function	addJWT(reply: FastifyReply, user: userDto) {

	const jwtAccess: string = await jwtGenerate(user, expAccess);
	setCookiesAccessToken(reply, jwtAccess);

	const jwtRefresh: string = await jwtGenerate(user, expRefresh);
	setCookiesAccessRefresh(reply, jwtRefresh);
}

export async function	removeJWT(reply: FastifyReply) {
	removeCookies(reply, "jwtAccess");
	removeCookies(reply, "jwtRefresh");
}

async function	refreshToken(request: FastifyRequest, reply: FastifyReply) {
	try {
		const cookies = getCookies(request);
		const refreshToken = cookies.jwtRefresh;
	
		const { payload, protectedHeader } = await jose.jwtVerify(refreshToken, jwtSecret);
		const user = await userServ.getUserById(payload.id);
		
		await addJWT(reply, user);

		return reply.status(200).send(user);
	} catch (err) {
		if (err instanceof jose.errors.JOSEError) {
			return reply.status(401).send(err);
		} else {
			return reply.status(404).send(err);
		}
	}
}

export async function	accessToken(request: FastifyRequest, reply: FastifyReply) {
	const cookies = getCookies(request);
	const accessToken = cookies.jwtAccess;
	
	try {
		const { payload, protectedHeader } = await jose.jwtVerify(accessToken, jwtSecret);
		const user = await userServ.getUserById(payload.id);

		return reply.status(200).send(user);
	} catch (err) {
		if (err instanceof jose.errors.JOSEError) {
			return await refreshToken(request, reply);
		} else {
			return reply.status(404).send(err);
		}
	}
}
