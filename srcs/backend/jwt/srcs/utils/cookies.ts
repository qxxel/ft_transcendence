/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookies.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 17:06:47 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:59:09 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE FUNCTIONS THAT READ OR WRITE COOKIES


/* ====================== IMPORT ====================== */

import { expAccess, expRefresh, expTwofa }	from "../jwt.js"

import type { FastifyReply }	from 'fastify'


/* ====================== FUNCTIONS ====================== */

// hostOnly ???
export function	setCookiesAccessToken(reply: FastifyReply, jwtAccess: string): void {
	reply.header(
		"Set-Cookie",
		`jwtAccess=${jwtAccess}; SameSite=strict; HttpOnly; secure; Max-Age=${expAccess.slice(0, -1)}; path=/`
		// `jwtAccess=${jwtAccess}; SameSite=none; HttpOnly; secure; Max-Age=${expAccess.slice(0, -1)}; path=/api`
	);
}

export function	setCookiesRefreshToken(reply: FastifyReply, jwtRefresh: string): void {
	reply.header(
		"Set-Cookie",
		`jwtRefresh=${jwtRefresh}; SameSite=strict; HttpOnly; secure; Max-Age=${expRefresh.slice(0, -1)}; path=/api/jwt/refresh`
		// `jwtRefresh=${jwtRefresh}; SameSite=none; HttpOnly; secure; Max-Age=${expRefresh.slice(0, -1)}; path=/api/jwt/refresh`
	);
}

export function	setCookiesTwofaToken(reply: FastifyReply, jwtTwofa: string): void {
	reply.header(
		"Set-Cookie",
		`jwtTwofa=${jwtTwofa}; SameSite=strict; HttpOnly; secure; Max-Age=${expTwofa.slice(0, -1)}; path=/api`
		// `jwtTwofa=${jwtTwofa}; SameSite=none; HttpOnly; secure; Max-Age=${expTwofa.slice(0, -1)}; path=/api`
	);
}

export function	removeCookies(reply: FastifyReply, key: string, path: string): void {
	reply.header(
		"Set-Cookie",
		`${key}=; SameSite=strict; HttpOnly; secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
		// `${key}=; SameSite=none; HttpOnly; secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
	);
}


export function	getCookies(cookie: string | undefined): Record<string, string> {
	return Object.fromEntries(
		(cookie || "")
		.split("; ")
		.map(c => c.split("="))
		.filter(([k, v]) => k && v)
	);
}
