/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validateJwt.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/24 22:08:37 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/26 22:15:59 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT VALIDATE JWT ACCESS TOKEN BEFORE ANY REQUEST


/* ====================== IMPORT ====================== */

import { gatewayAxios }	from "../api-gateway.js"

import type { AxiosHeaderValue, AxiosResponse }	from 'axios'
import type { FastifyRequest }					from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	getValidUserId(request: FastifyRequest): Promise<AxiosHeaderValue> {
	const	response: AxiosResponse = await gatewayAxios.get('https://jwt:3000/validate',
		{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
	);

	return response.data.id;
}
