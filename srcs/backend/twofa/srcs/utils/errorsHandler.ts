/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:00:28 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import axios			from 'axios'
import * as twofaError	from "./throwErrors.js"

import type { FastifyInstance, FastifyReply } from "fastify"


/* ====================== FUNCTION ====================== */

async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function	logError(twofaFastify: FastifyInstance, err: string): void {
	twofaFastify.log.error(err);
	console.error(err);
}

export async function	errorsHandler(twofaFastify: FastifyInstance, reply: FastifyReply, err: unknown): Promise<FastifyReply> {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error) {
			logError(twofaFastify, err.response.data.error);
			return reply.code(err.response?.status || 400).send({ error: err.response.data.error });
		}
		logError(twofaFastify, err.message);
		return reply.code(400).send({ error: err.message })
	} else if (err instanceof twofaError.RequestEmptyError) {
		logError(twofaFastify, err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	} else if (err instanceof twofaError.WrongCodeError) {
		await sleep(1000);
		logError(twofaFastify, err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	} else if (err instanceof Error) {
		logError(twofaFastify, err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	}
	twofaFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}