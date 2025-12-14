/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:59:17 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import * as jose		from 'jose'
import axios			from 'axios'
import * as jwtError	from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from 'fastify'


/* ====================== FUNCTION ====================== */

function	logError(jwtFastify: FastifyInstance, err: string): void {
	jwtFastify.log.error(err);
	console.error(err);
}

export function	errorsHandler(jwtFastify: FastifyInstance, reply: FastifyReply, err: unknown): FastifyReply {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error) {
			logError(jwtFastify, err.response.data.error);
			return reply.code(err.response?.status || 400).send({ error: err.response.data.error });
		}
		logError(jwtFastify, err.message);
		return reply.code(400).send({ error: err.message })
	} else if (err instanceof jwtError.RequestEmptyError) {
		logError(jwtFastify, err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	} else if (err instanceof jose.errors.JOSEError) {
		logError(jwtFastify, err.message);
		return reply.status(401).send({ errorType: err.name, error: err.message });
	} else if (err instanceof jwtError.UnauthorizedTokenError) {
		logError(jwtFastify, err.message);
		return reply.status(401).send({ errorType: err.name, error: err.message });
	} else if (err instanceof jwtError.MissingTokenError) {
		logError(jwtFastify, err.message);
		return reply.code(401).send({ errorType: err.name, error: err.message });
	}  else if (err instanceof jwtError.MissingIdError) {
		logError(jwtFastify, err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	}else if (err instanceof Error) {
		logError(jwtFastify, err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	}
	jwtFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}