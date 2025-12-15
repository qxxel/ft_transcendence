/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:49:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:54:09 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE AND LOG ERRORS FOR USER SERVICE REQUESTS


/* ====================== IMPORTS ====================== */

import { NotExistError } from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

export function	errorsHandler(userFastify: FastifyInstance, reply: FastifyReply, err: unknown): FastifyReply {
	if (err instanceof NotExistError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(400).send({ error: err.message });
	}

	if (err instanceof Error)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(400).send({ error: err.message });
	}

	userFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}