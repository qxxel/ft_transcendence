/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:35:13 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE AND LOG ALL ERRORS FOR AUTH SERVICE REQUESTS


/* ====================== IMPORTS ====================== */

import axios			from 'axios'
import * as authError	from "./throwErrors.js"


import type { FastifyInstance, FastifyReply } from 'fastify'


/* ====================== FUNCTION ====================== */

async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function	logError(authFastify: FastifyInstance, error: string): void {
	authFastify.log.error(error);
	console.error(error);
}

export async function	errorsHandler(authFastify: FastifyInstance, reply: FastifyReply, error: unknown): Promise<FastifyReply> {
	if (axios.isAxiosError(error)) {
		if (error.response?.data?.error) {
			logError(authFastify, error.response.data.error);
			return reply.code(error.response?.status || 400).send({ error: error.response.data.error });
		}
		logError(authFastify, error.message);
		return reply.code(400).send({ error: error.message })
	} else if (error instanceof authError.RequestEmptyError) {
		logError(authFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	} else if (error instanceof authError.AlreadyConnectedError) {
		logError(authFastify, error.message);
		return reply.code(409).send({ errorType: error.name, error: error.message });
	} else if (error instanceof authError.WrongCredentialsError) {
		await sleep(1000);
		logError(authFastify, error.message);
		return reply.code(401).send({ errorType: error.name, error: error.message });
	} else if (error instanceof authError.InvalidSyntaxError) {
		logError(authFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	} else if (error instanceof authError.MissingIdError) {
		logError(authFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	} else if (error instanceof Error) {
		logError(authFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	}
	authFastify.log.error(error);
	console.log(error);
	return reply.code(400).send({ error: error });
}