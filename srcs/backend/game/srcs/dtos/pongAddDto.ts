/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongAddDto.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 19:04:52 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 13:42:49 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW PONG GAMES


/* ====================== IMPORTS ====================== */

// import { isValidName, isValidEmail }	from "../utils/validation.js"
// import { ValidationError }				from "../utils/throwErrors.js"

// import type { validationResult }	from "../utils/validation.js"


/* ====================== CLASS ====================== */

export class	pongAddDto {
	private	idClient: number;
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


	getTable(): [number, number, string, number, string, number, string, boolean, number, number] {
		return [
			this.idClient,
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
