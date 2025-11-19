/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtManagement.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 17:14:11 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:19:18 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL FUNCTIONS THAT MANAGE JWT TOKENS


/* ====================== IMPORTS ====================== */

import * as jose														from 'jose'
import { jwtSecret, expAccess, expRefresh }								from "../jwt.js"
import { setCookiesAccessToken, setCookiesRefreshToken, removeCookies }	from "./cookies.js"


import type { FastifyReply }	from 'fastify'
import type { userDto }	from "../dtos/userDto.js"


/* ====================== FUNCTIONS ====================== */

export async function	jwtGenerate(user: userDto, exp: string): Promise<string> {
	return await new jose.SignJWT( {
			'id': user.id,
			'username': user.username,
			'email': user.email
		})
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setIssuedAt()
		.setExpirationTime(exp)
		.sign(jwtSecret);
}

export async function	addJWT(reply: FastifyReply, user: userDto): Promise<string> {
	const	jwtAccess: string = await jwtGenerate(user, expAccess);
	setCookiesAccessToken(reply, jwtAccess);

	const	jwtRefresh: string = await jwtGenerate(user, expRefresh);
	setCookiesRefreshToken(reply, jwtRefresh);

	return jwtRefresh;
}

export async function	removeJWT(reply: FastifyReply): Promise<void> {
	removeCookies(reply, "jwtAccess", "/api");
	removeCookies(reply, "jwtRefresh", "/api/jwt/refresh");
}
