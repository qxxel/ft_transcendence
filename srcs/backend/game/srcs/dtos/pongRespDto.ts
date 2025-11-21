/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongRespDto.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 19:20:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/20 20:42:25 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW PONG GAMES


/* ====================== IMPORTS ====================== */

// import { isValidName, isValidEmail }	from "../utils/validation.js"
// import { ValidationError }				from "../utils/throwErrors.js"

// import type { validationResult }	from "../utils/validation.js"


/* ====================== class	====================== */

export class	pongRespDto {
	private id: number;
	private	winner: number;
	private	p1: number;
	private	p2: number;
	private	p1score: number;
	private	p2score: number;
	private	start: number;
	private	duration: number;

	constructor(row: any) {
		this.id = row.id;
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
