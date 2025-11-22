/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsRespDto.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 16:54:53 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 18:54:56 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR USER STATS


/* ====================== CLASS ====================== */

export class	userStatsRespDto {
	private	id: number;
	private	userId: number;

	private	pongElo: number;
	private	tankElo: number;

	private	pongWins: number;
	private	pongLosses: number;
	private	pongTotalTime: number;
	private	pongPointsMarked: number;

	private	tankWins: number;
	private	tankLosses: number;
	private	tankTotalTime: number;
	private	tankKills: number;


	constructor(row: any) {
		this.id = row.id;
		this.userId = row.user_id;

		this.pongElo = row.pong_elo;
		this.tankElo = row.tank_elo;

		this.pongWins = row.pong_wins;
		this.pongLosses = row.pong_losses;
		this.pongTotalTime = row.pong_total_time;
		this.pongPointsMarked = row.pong_points_marked;

		this.tankWins = row.tank_wins;
		this.tankLosses = row.tank_losses;
		this.tankTotalTime = row.tank_total_time;
		this.tankKills = row.tank_kills;
	}


	getTable(): number[] {
		return [
			this.id,
			this.userId,
			this.pongElo,
			this.tankElo,
			this.pongWins,
			this.pongLosses,
			this.pongTotalTime,
			this.pongPointsMarked,
			this.tankWins,
			this.tankLosses,
			this.tankTotalTime,
			this.tankKills
		];
	}
}
