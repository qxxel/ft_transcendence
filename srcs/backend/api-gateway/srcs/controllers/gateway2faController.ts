/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gateway2faController.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 23:09:42 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/19 23:11:56 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from '../api-gateway.js'
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gateway2faController(gatewayFastify: FastifyInstance) {

	gatewayFastify.get('/opt', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.get(
				'https://2fa:3000/opt',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);
			
			if (response.headers['set-cookie'])
				reply.header('Set-Cookie', response.headers['set-cookie']);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});
}