/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsAdd.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 16:51:49 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW USER STATS


/* ====================== CLASS ====================== */

export class	userStatsAddDto {
	private	userId: number;


	constructor(row: any) {
		this.userId = row.userId;
	}


	getTable(): [number] {
		return [
			this.userId
		];
	}
}
