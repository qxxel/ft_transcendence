/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:45:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 14:27:23 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT AUTH SERVICE RECEIVE

/* ====================== IMPORT ====================== */

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify';

import { authServ } 	from "../auth.js";


/* ====================== FUNCTIONS ====================== */

export async function	authController(authFastify: FastifyInstance) {
	// [...]
}
