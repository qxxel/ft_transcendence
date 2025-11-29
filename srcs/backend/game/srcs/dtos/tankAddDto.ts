/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tankAddDto.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 20:43:37 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW TANK GAMES


/* ====================== IMPORTS ====================== */

// import { isValidName, isValidEmail }	from "../utils/validation.js"
// import { ValidationError }				from "../utils/throwErrors.js"

// import type { validationResult }	from "../utils/validation.js"


/* ====================== CLASS ====================== */

export class	tankAddDto {
	private	winner: number;
	private	p1: number;
	private	p2: number;
	private	p3: number;
	private	p4: number;
	private	p1kill: number;
	private	p2kill: number;
	private	p3kill: number;
	private	p4kill: number;
	private	start: number;
	private	duration: number;

	constructor(row: any) {
		this.winner = row.winner;
		this.p1 = row.p1;
		this.p2 = row.p2;
		this.p3 = row.p3;
		this.p4 = row.p4;
		this.p1kill = row.p1score;
		this.p2kill = row.p2score;
		this.p3kill = row.p3score;
		this.p4kill = row.p4score;
		this.start = row.start;
		this.duration = row.duration;
	}


	getTable(): number[] {
		return [
			this.winner,
			this.p1,
			this.p1kill,
			this.p2,
			this.p2kill,
			this.p3,
			this.p3kill,
			this.p4,
			this.p4kill,
			this.start,
			this.duration
		]
	}


	// GETTERS
	getWinner(): number {
		return this.winner;
	}

	getP1(): number {
		return this.p1;
	}

	getP2(): number {
		return this.p2;
	}

	getP3(): number {
		return this.p3;
	}

	getP4(): number {
		return this.p4;
	}

	getP1Kill(): number {
		return this.p1kill;
	}

	getP2Kill(): number {
		return this.p2kill;
	}

	getP3Kill(): number {
		return this.p3kill;
	}

	getP4Kill(): number {
		return this.p4kill;
	}

	getStart(): number {
		return this.start;
	}

	getDuration(): number {
		return this.duration;
	}
}
