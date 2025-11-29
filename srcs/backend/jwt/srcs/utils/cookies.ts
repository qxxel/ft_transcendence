/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookies.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 17:06:47 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 07:45:21 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE FUNCTIONS THAT READ OR WRITE COOKIES


/* ====================== IMPORT ====================== */

import { expAccess, expRefresh, expTwofa }	from "../jwt.js"

import type { FastifyRequest, FastifyReply }	from "fastify"


/* ====================== IMPORT ====================== */

// hostOnly ???
export function	setCookiesAccessToken(reply: FastifyReply, jwtAccess: string): void {
	reply.header(
		"Set-Cookie",
		`jwtAccess=${jwtAccess}; SameSite=strict; HttpOnly; secure; Max-Age=${expAccess.slice(0, -1)}; path=/api`
	);
}

export function	setCookiesRefreshToken(reply: FastifyReply, jwtRefresh: string): void {
	reply.header(
		"Set-Cookie",
		`jwtRefresh=${jwtRefresh}; SameSite=strict; HttpOnly; secure; Max-Age=${expRefresh.slice(0, -1)}; path=/api/jwt/refresh`
	);
}

export function	setCookiesTwofaToken(reply: FastifyReply, jwtTwofa: string): void {
	reply.header(
		"Set-Cookie",
		`jwtTwofa=${jwtTwofa}; SameSite=strict; HttpOnly; secure; Max-Age=${expTwofa.slice(0, -1)}; path=/api`
	);
}

export function	removeCookies(reply: FastifyReply, key: string, path: string): void {
	reply.header(
		"Set-Cookie",
		`${key}=; SameSite=strict; HttpOnly; secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
	);
}


export function	getCookies(request: FastifyRequest): any {
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
