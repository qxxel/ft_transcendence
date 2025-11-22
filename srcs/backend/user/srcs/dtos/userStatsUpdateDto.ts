/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsUpdateDto.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:13:44 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 17:54:46 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR UPDATES OF USER STATS


/* ====================== CLASSES ====================== */

export class	userStatsPongUpdateDto {
	private gameType: string;

	private	userId: number;

	private	winner: boolean;
	private	eloAdd: number;
	private	time: number;
	private	pointsMarked: number;


	constructor(row: any, userId: number) {
		this.gameType = row.gameType;

		this.userId = userId;

		this.winner = row.winner ? true : false;
		this.eloAdd = row.eloAdd;
		this.time = row.time;
		this.pointsMarked = row.pointsMarked;
	}


	getTable(): number[] {
		return [
			this.eloAdd,
			this.time,
			this.pointsMarked,
			this.userId
		];
	}

	getType(): string {
		return this.gameType;
	}

	isWinner(): boolean {
		return this.winner;
	}
}

export class	userStatsTankUpdateDto {
	private gameType: string;

	private	userId: number;
	
	private	winner: boolean;
	private	eloAdd: number;
	private	time: number;
	private	kills: number;

	constructor(row: any, userId: number) {
		this.gameType = row.gameType;

		this.userId = userId;

		this.winner = row.winner ? true : false;
		this.eloAdd = row.eloAdd;
		this.time = row.time;
		this.kills = row.kills;
	}


	getTable(): number[] {
		return [
			this.eloAdd,
			this.time,
			this.kills,
			this.userId
		];
	}

	getType(): string {
		return this.gameType;
	}

	isWinner(): boolean {
		return this.winner;
	}
}
