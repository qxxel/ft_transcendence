/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:49:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:35:30 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE AND LOG ERRORS FOR USER SERVICE REQUESTS


/* ====================== IMPORTS ====================== */

import { NotExistError } from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

export function	errorsHandler(userFastify: FastifyInstance, reply: FastifyReply, error: unknown): FastifyReply {
	if (error instanceof NotExistError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(400).send({ error: error.message });
	}

	if (error instanceof Error)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(400).send({ error: error.message });
	}

	userFastify.log.error(error);
	console.log(error);
	return reply.code(400).send({ error: error });
}