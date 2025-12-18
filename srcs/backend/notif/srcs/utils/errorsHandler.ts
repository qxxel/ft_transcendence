/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:49:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 20:12:46 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE ALL ERRORS FOR THE USER SERVICE


/* ====================== IMPORTS ====================== */

import { MissingHeaderError }	from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

export function	errorsHandler(userFastify: FastifyInstance, reply: FastifyReply, err: unknown): FastifyReply {
	if (err instanceof MissingHeaderError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(401).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof Error)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	}

	userFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}
