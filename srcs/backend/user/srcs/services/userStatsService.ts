/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsService.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:23:04 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:31:09 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL USER STATS REPOSITORY FUNCTIONS


/* ====================== IMPORTS ====================== */

// import { userStatsAddDto }		from "../dtos/userStatsAddDto.js"
import { userStatsRepository }	from "../repositories/userStatsRepository.js"
// import { userStatsRespDto }		from "../dtos/userStatsRespDto.js"

// import { IsTakenError, NotExistError }	from "../utils/throwErrors.js"


/* ====================== CLASS ====================== */

export class	userStatsService {
	private	usersRepo: userStatsRepository;

	constructor(userRepo: userStatsRepository) {
		this.usersRepo = userRepo;
	}
}
