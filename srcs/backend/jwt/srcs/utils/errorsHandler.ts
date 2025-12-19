/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:36:01 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE AND LOG ALL ERRORS FOR JWT SERVICE REQUESTS


/* ====================== IMPORTS ====================== */

import * as jose		from 'jose'
import axios			from 'axios'
import * as jwtError	from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from 'fastify'


/* ====================== FUNCTION ====================== */

function	logError(jwtFastify: FastifyInstance, error: string): void {
	jwtFastify.log.error(error);
	console.error(error);
}

export function	errorsHandler(jwtFastify: FastifyInstance, reply: FastifyReply, error: unknown): FastifyReply {
	if (axios.isAxiosError(error)) {
		if (error.response?.data?.error) {
			logError(jwtFastify, error.response.data.error);
			return reply.code(error.response?.status || 400).send({ error: error.response.data.error });
		}
		logError(jwtFastify, error.message);
		return reply.code(400).send({ error: error.message })
	} else if (error instanceof jwtError.RequestEmptyError) {
		logError(jwtFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	} else if (error instanceof jose.errors.JOSEError) {
		logError(jwtFastify, error.message);
		return reply.status(401).send({ errorType: error.name, error: error.message });
	} else if (error instanceof jwtError.UnauthorizedTokenError) {
		logError(jwtFastify, error.message);
		return reply.status(401).send({ errorType: error.name, error: error.message });
	} else if (error instanceof jwtError.MissingTokenError) {
		logError(jwtFastify, error.message);
		return reply.code(401).send({ errorType: error.name, error: error.message });
	}  else if (error instanceof jwtError.MissingIdError) {
		logError(jwtFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	}else if (error instanceof Error) {
		logError(jwtFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	}
	jwtFastify.log.error(error);
	console.log(error);
	return reply.code(400).send({ error: error });
}