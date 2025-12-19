/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 18:49:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:36:28 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE ALL ERRORS FOR THE USER SERVICE


/* ====================== IMPORTS ====================== */

import { IsTakenError, NotExistError, NoFileError }		from "./throwErrors.js"
import { GameNotFoundError, AlreadyRelatedError }		from "./throwErrors.js"
import { MissingHeaderError, InvalidFileError }			from "./throwErrors.js"
import { AlreadyAcceptedError, NoRelationError }		from "./throwErrors.js"
import { BlockedError, SelfFriendRequestError }			from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

export function	errorsHandler(userFastify: FastifyInstance, reply: FastifyReply, error: unknown): FastifyReply {
	if (error instanceof IsTakenError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(409).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof NotExistError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(404).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof GameNotFoundError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(404).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof AlreadyRelatedError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(404).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof AlreadyAcceptedError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(404).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof NoRelationError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(404).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof BlockedError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(404).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof SelfFriendRequestError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(404).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof MissingHeaderError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(401).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof InvalidFileError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	}

	if (error instanceof NoFileError)
	{
		userFastify.log.error(error.message);
		console.error(error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
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
