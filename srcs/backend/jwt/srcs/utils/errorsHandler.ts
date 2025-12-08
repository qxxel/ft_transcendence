/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/03 22:08:19 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import * as jose		from 'jose'
import * as jwtError	from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

function	logError(jwtFastify: FastifyInstance, err: string): void {
	jwtFastify.log.error(err);
	console.error(err);
}

export function	errorsHandler(jwtFastify: FastifyInstance, reply: FastifyReply, err: unknown): FastifyReply {
	if (err instanceof jose.errors.JOSEError) {
		logError(jwtFastify, err.message);
		return reply.status(401).send({ errorType: err.name, error: err.message });
	} else if (err instanceof jwtError.MissingIdError) {
		logError(jwtFastify, err.message);
		return reply.code(418).send({ errorType: err.name, error: err.message });
	}
	jwtFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}