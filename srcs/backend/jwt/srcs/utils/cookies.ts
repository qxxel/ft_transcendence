/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookies.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 17:06:47 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 21:37:39 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE FUNCTIONS THAT READ OR WRITE COOKIES


/* ====================== IMPORT ====================== */

import type { FastifyRequest, FastifyReply }	from "fastify";


/* ====================== IMPORT ====================== */

// hostOnly ???
export function	setCookiesAccessToken(reply: FastifyReply, jwtAccess: string) {
	reply.header(
		"Set-Cookie",
		`jwtAccess=${jwtAccess}; SameSite=strict; HttpOnly; secure; Max-Age=1000; path=/api/`
	);
}

export function	setCookiesRefreshToken(reply: FastifyReply, jwtRefresh: string) {
	reply.header(
		"Set-Cookie",
		`jwtRefresh=${jwtRefresh}; SameSite=strict; HttpOnly; secure; Max-Age=10000; path=/api/jwt/refresh`
	);
}

export function	removeCookies(reply: FastifyReply, key: string) {
	reply.header(
		"Set-Cookie",
		`${key}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
	);
}


export function	getCookies(request: FastifyRequest) {
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
