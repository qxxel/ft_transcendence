/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:49:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 19:29:54 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


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