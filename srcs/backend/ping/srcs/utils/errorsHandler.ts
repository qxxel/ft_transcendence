/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/18 06:24:24 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE AND LOG ALL ERRORS FOR PING SERVICE REQUESTS


/* ====================== IMPORTS ====================== */

import axios			from 'axios'

import type { FastifyInstance, FastifyReply } from 'fastify'


/* ====================== FUNCTION ====================== */

function	logError(pingFastify: FastifyInstance, err: string): void {
	pingFastify.log.error(err);
	console.error(err);
}

export async function	errorsHandler(pingFastify: FastifyInstance, reply: FastifyReply, err: unknown): Promise<FastifyReply> {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error) {
			logError(pingFastify, err.response.data.error);
			return reply.code(err.response?.status || 400).send({ error: err.response.data.error });
		}
		logError(pingFastify, err.message);
		return reply.code(400).send({ error: err.message })
	} else if (err instanceof Error) {
		logError(pingFastify, err.message);
		return reply.code(400).send({ errorType: err.name, error: err.message });
	}
	pingFastify.log.error(err);
	console.log(err);
	return reply.code(400).send({ error: err });
}