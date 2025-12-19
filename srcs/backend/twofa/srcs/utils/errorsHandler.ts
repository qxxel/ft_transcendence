/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:36:30 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE AND LOG ALL ERRORS FOR 2FA SERVICE REQUESTS


/* ====================== IMPORTS ====================== */

import axios			from 'axios'
import * as twofaError	from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function	logError(twofaFastify: FastifyInstance, error: string): void {
	twofaFastify.log.error(error);
	console.error(error);
}

export async function	errorsHandler(twofaFastify: FastifyInstance, reply: FastifyReply, error: unknown): Promise<FastifyReply> {
	if (axios.isAxiosError(error)) {
		if (error.response?.data?.error) {
			logError(twofaFastify, error.response.data.error);
			return reply.code(error.response?.status || 400).send({ error: error.response.data.error });
		}
		logError(twofaFastify, error.message);
		return reply.code(400).send({ error: error.message })
	} else if (error instanceof twofaError.RequestEmptyError) {
		logError(twofaFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	} else if (error instanceof twofaError.WrongCodeError) {
		await sleep(1000);
		logError(twofaFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	} else if (error instanceof twofaError.MissingIdError) {
		logError(twofaFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	} else if (error instanceof Error) {
		logError(twofaFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	}
	twofaFastify.log.error(error);
	console.log(error);
	return reply.code(400).send({ error: error });
}