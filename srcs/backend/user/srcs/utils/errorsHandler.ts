/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:49:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 22:11:07 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import { IsTakenError, NotExistError, GameNotFoundError, AlreadyRelatedError, MissingHeaderError, InvalidFileError, NoFileError }	from "./throwErrors.js"
import { AlreadyAcceptedError, NoRelationError, BlockedError, SelfFriendRequestError } from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

export function	errorsHandler(userFastify: FastifyInstance, reply: FastifyReply, err: unknown): FastifyReply {
	if (err instanceof IsTakenError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(409).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof NotExistError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(404).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof GameNotFoundError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(404).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof AlreadyRelatedError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(404).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof AlreadyAcceptedError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(404).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof NoRelationError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(404).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof BlockedError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(404).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof SelfFriendRequestError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(404).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof MissingHeaderError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(401).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof InvalidFileError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	}

	if (err instanceof NoFileError)
	{
		userFastify.log.error(err.message);
		console.error(err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
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
