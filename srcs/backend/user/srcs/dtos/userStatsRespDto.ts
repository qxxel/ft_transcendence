/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsRespDto.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 16:54:53 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR USER STATS


/* ====================== CLASS ====================== */

export class	userStatsRespDto {
	private	id: number;
	private	userId: number;

	private	pongWins: number;
	private	pongLooses: number;
	private	pongTotalTime: number;
	private	pongPointsMarked: number;

	private	tankWins: number;
	private	tankLosses: number;
	private	tankTotalTime: number;
	private	tankKills: number;


	constructor(row: any) {
		this.id = row.id;
		this.userId = row.userId;

		this.pongWins = row.pongWins;
		this.pongLooses = row.pongLooses;
		this.pongTotalTime = row.pongTotalTime;
		this.pongPointsMarked = row.pongPointsMarked;

		this.tankWins = row.tankWins;
		this.tankLosses = row.tankLosses;
		this.tankTotalTime = row.tankTotalTime;
		this.tankKills = row.tankKills;
	}


	getTable(): number[] {
		return [
			this.id,
			this.userId,
			this.pongWins,
			this.pongLooses,
			this.pongTotalTime,
			this.pongPointsMarked,
			this.tankWins,
			this.tankLosses,
			this.tankTotalTime,
			this.tankKills
		];
	}
}
