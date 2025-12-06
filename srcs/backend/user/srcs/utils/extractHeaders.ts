/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   extractHeaders.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 17:40:02 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 16:16:49 by agerbaud         ###   ########.fr       */
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

	const	userId = parseInt(userIdHeader as string, 10);

	return userId;
}
