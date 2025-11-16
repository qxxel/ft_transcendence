/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 14:26:56 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT JWT SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';

import { jwtServ } 	from "../jwt.js";


/* ====================== FUNCTIONS ====================== */

export async function	jwtController(jwtFastify: FastifyInstance) {
	// [...]
}
