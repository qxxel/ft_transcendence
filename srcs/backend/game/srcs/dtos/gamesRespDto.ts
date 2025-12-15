/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesRespDto.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 19:20:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:38:30 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW GAMES


/* ====================== CLASS ====================== */

export class	gamesRespDto {
	private id: number;
	private	idClient: number;
	private	gameType: number;
	private	winner: number;
	private	p1: number;
	private	p2: number;
	private	p1score: number;
	private	p2score: number;
	private	start: number;
	private	duration: number;

	constructor(row: any) {
		this.id = row.id;
		this.idClient = row.id_client;
		this.gameType = row.game_type;
		this.winner = row.winner;
		this.p1 = row.p1;
		this.p2 = row.p2;
		this.p1score = row.p1score;
		this.p2score = row.p2score;
		this.start = row.start;
		this.duration = row.duration;
	}


	// GETTERS
	getId(): number {
		return this.id;
	}

	getIdClient(): number {
		return this.idClient;
	}

	getGameType(): number {
		return this.gameType;
	}

	getWinner(): number {
		return this.winner;
	}

	getP1(): number {
		return this.p1;
	}

	getP2(): number {
		return this.p2;
	}

	getP1Score(): number {
		return this.p1score;
	}

	getP2Score(): number {
		return this.p2score;
	}

	getStart(): number {
		return this.start;
	}

	getDuration(): number {
		return this.duration;
	}
}
