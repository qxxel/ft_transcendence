/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/13 00:09:24 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import * as authError	from "./throwErrors.js"
import axios			from 'axios'


import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function	logError(authFastify: FastifyInstance, err: string): void {
	authFastify.log.error(err);
	console.error(err);
}

export async function	errorsHandler(authFastify: FastifyInstance, reply: FastifyReply, err: unknown): Promise<FastifyReply> {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error) {
			logError(authFastify, err.response.data.error);
			return reply.code(418).send({ error: err.response.data.error });
		}
		logError(authFastify, err.message);
		return reply.code(418).send({ error: err.message })
	} else if (err instanceof authError.RequestEmptyError) {
		logError(authFastify, err.message);
		return reply.code(418).send({ errorType: err.name, error: err.message });
	} else if (err instanceof authError.WrongCredentialsError) {
		await sleep(1000);
		logError(authFastify, err.message);
		return reply.code(418).send({ errorType: err.name, error: err.message });
	} else if (err instanceof authError.InvalidSyntaxError) {
		logError(authFastify, err.message);
		return reply.code(418).send({ errorType: err.name, error: err.message });
	} else if (err instanceof authError.MissingIdError) {
		logError(authFastify, err.message);
		return reply.code(418).send({ errorType: err.name, error: err.message });
	} else if (err instanceof Error) {
		logError(authFastify, err.message);
		return reply.code(418).send({ errorType: err.name, error: err.message });
	}
	authFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}