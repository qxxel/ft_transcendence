/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   extractHeaders.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 16:17:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 00:11:33 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL FUNCTIONS THAT EXTRACT ANY HEADERS


/* ====================== IMPORT ====================== */

import { MissingHeaderError }	from "./throwErrors.js"

import type { FastifyRequest }	from 'fastify'


/* ====================== FUNCTION ====================== */

export function	extractUserId(request: FastifyRequest): number {
	const	userIdHeader: string | string[] | undefined = request.headers['user-id'];
	if (!userIdHeader)
		throw new MissingHeaderError("Missing User ID header (Unauthorized)");

	const	userId: number = parseInt(userIdHeader as string, 10);

	return userId;
}
