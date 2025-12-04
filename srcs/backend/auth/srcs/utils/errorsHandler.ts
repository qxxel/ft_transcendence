/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/04 20:00:19 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import * as twofaError	from "./throwErrors.js"
import axios			from 'axios'


import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

function	logError(jwtFastify: FastifyInstance, err: string): void {
	jwtFastify.log.error(err);
	console.error(err);
}

export function	errorsHandler(twofaFastify: FastifyInstance, reply: FastifyReply, err: unknown): FastifyReply {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error)
			return reply.code(418).send({ error: err.response.data.error });

		return reply.code(418).send({ error: err.message })
	} else if (err instanceof twofaError.RequestEmptyError) {
		logError(twofaFastify, err.message);
		return reply.code(418).send({ errorType: err.name, error: err.message });
	}
	twofaFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}