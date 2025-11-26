/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsController.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:26:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:34:56 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR USER STATS TABLE


/* ====================== IMPORTS ====================== */

import { errorsHandler }		from "../utils/errorsHandler.js"
import { userStatsAddDto }		from "../dtos/userStatsAddDto.js"
import { userStatsRespDto }		from "../dtos/userStatsRespDto.js"
import { userStatsServ } 		from "../user.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	userStatsController(userFastify: FastifyInstance): Promise<void> {
	
}
