/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsService.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/22 14:02:53 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 14:47:15 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL FRIENDSHIPS REPOSITORY FUNCTIONS


/* ====================== IMPORTS ====================== */

import { friendshipsAddDto }		from "../dtos/friendshipsAddDto.js"
import { friendshipsRepository }	from "../repositories/friendshipsRepository.js"
import { friendshipsRespDto }		from "../dtos/friendshipsRespDto.js"

import { IsTakenError, NotExistError }	from "../utils/throwErrors.js"


/* ====================== CLASS ====================== */

export class	friendshipsService {
	private	friendshipsRepo: friendshipsRepository;

	constructor(friendshipsRepo: friendshipsRepository) {
		this.friendshipsRepo = friendshipsRepo;
	}
}
