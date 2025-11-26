/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayGameController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:05:35 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/26 23:27:32 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/game`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from '../api-gateway.js'
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayGameController(gatewayFastify: FastifyInstance) {
	gatewayFastify.post('/pong', async (request: FastifyRequest, reply: FastifyReply) => {						//
		try {																									//
			const	response: AxiosResponse = await gatewayAxios.post('https://game:3000/pong', request.body);	//
																												//
			return reply.send(response.data);																	//	A ENLEVER
		} catch (err: unknown) {																				//
			return requestErrorsHandler(gatewayFastify, reply, err);											//
		}																										//
	});																											//

	gatewayFastify.post('/tank', async (request: FastifyRequest, reply: FastifyReply) => {						//
		try {																									//
			const	response: AxiosResponse = await gatewayAxios.post('https://game:3000/tank', request.body);	//
																												//
			return reply.send(response.data);																	//	A ENLEVER
		} catch (err: unknown) {																				//
			return requestErrorsHandler(gatewayFastify, reply, err);											//
		}																										//
	});																											//
}																												//
