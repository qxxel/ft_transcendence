/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errorsHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:48:40 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:50:49 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE AND LOG ALL ERRORS FOR PING SERVICE REQUESTS


/* ====================== IMPORTS ====================== */

import axios			from 'axios'

import type { FastifyInstance, FastifyReply } from 'fastify'


/* ====================== FUNCTION ====================== */

function	logError(pingFastify: FastifyInstance, error: string): void {
	pingFastify.log.error(error);
	console.error(error);
}

export async function	errorsHandler(pingFastify: FastifyInstance, reply: FastifyReply, error: unknown): Promise<FastifyReply> {
	if (axios.isAxiosError(error)) {
		if (error.response?.data?.error) {
			logError(pingFastify, error.response.data.error);
			return reply.code(error.response?.status || 400).send({ error: error.response.data.error });
		}
		logError(pingFastify, error.message);
		return reply.code(400).send({ error: error.message })
	} else if (error instanceof Error) {
		logError(pingFastify, error.message);
		return reply.code(400).send({ errorType: error.name, error: error.message });
	}
	pingFastify.log.error(error);
	console.log(error);
	return reply.code(400).send({ error: error });
}