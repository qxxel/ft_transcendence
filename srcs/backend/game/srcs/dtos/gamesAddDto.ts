/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesAddDto.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 19:04:52 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:49:23 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW GAMES

/* ====================== CLASS ====================== */

export class	gamesAddDto {
	private	idClient: number;
	private	gameType: number;
	private	winner: number;
	private	p1: string;
	private	p1score: number;
	private	p2: string;
	private	p2score: number;
	private	mode: string;
	private	powerup: boolean;
	private	start: number;
	private	duration: number;

	constructor(row: any) {
		this.idClient = row.idClient;
		this.gameType = row.gameType;
		this.winner = row.winner;
		this.p1 = row.p1;
		this.p2 = row.p2;
		this.p1score = row.p1score;
		this.p2score = row.p2score;
		this.mode = row.mode;
		this.powerup = row.powerup;
		this.start = row.start;
		this.duration = row.duration;
	}


	getTable(): [number, number, number, string, number, string, number, string, boolean, number, number] {
		return [
			this.idClient,
			this.gameType,
			this.winner,
			this.p1,
			this.p1score,
			this.p2,
			this.p2score,
			this.mode,
			this.powerup,
			this.start,
			this.duration
		]
	}
}
