/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:49:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:49:49 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE ALL ERRORS FOR THE USER SERVICE


/* ====================== IMPORTS ====================== */

import { MissingHeaderError }	from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from 'fastify'


/* ====================== FUNCTION ====================== */

export function	errorsHandler(userFastify: FastifyInstance, reply: FastifyReply, error: unknown): FastifyReply {
	if (error instanceof MissingHeaderError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(401).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof Error)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	}

	userFastify.log.error(error);
	console.log(error);
	return reply.code(400).send({ error: error });
}
