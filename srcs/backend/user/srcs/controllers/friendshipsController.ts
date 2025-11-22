/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:38:43 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 14:06:30 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR FRIENDSHIPS TABLE


/* ====================== IMPORTS ====================== */

import { errorsHandler }		from "../utils/errorsHandler.js"
import { friendshipsAddDto }		from "../dtos/friendshipsAddDto.js"
import { friendshipsRespDto }		from "../dtos/friendshipsRespDto.js"
import { friendshipsServ } 		from "../user.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	friendshipsController(userFastify: FastifyInstance): Promise<void> {
	
}
