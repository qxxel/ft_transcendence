/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   requestErrors.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:37:41 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 22:09:49 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE ERRORS FROM REQUESTS


/* ====================== IMPORTS ====================== */

import axios	from 'axios'

import type { FastifyInstance, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export function	requestErrorsHandler(gatewayFastify: FastifyInstance, reply: FastifyReply, err: unknown): FastifyReply {
	gatewayFastify.log.error(err);

	if (axios.isAxiosError(err))
	{
		if (err.response)
		{
			console.error("Error from a service :", err.response.data);
			return reply.status(err.response.status).send(err.response.data);
		}

		console.error("Error: service unavailable");
		return reply.status(503).send({ error: 'Service unavailable' });
	}

	console.error("Error: enternal gateway error");
	return reply.status(500).send({ error: 'Internal gateway error' });
}
