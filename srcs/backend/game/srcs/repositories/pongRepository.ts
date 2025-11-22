/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:54:55 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 16:35:32 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF PONG DB AND HANDLE CLASSIC METHODS OF THIS DB


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { resolve } from "path";
import { pongAddDto }		from "../dtos/pongAddDto.js"
import { pongRespDto }		from "../dtos/pongRespDto.js"
import { pongTableBuilder }	from "../tableBuilders/pongTableBuilder.js"

import type { Database }	from 'sqlite3'

/* ====================== interface	====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
interface	StatementWithLastID {
    lastID: number;
}


/* ====================== CLASS ====================== */

export class	pongRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			pongTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	async addPongGame(pongAddDto: pongAddDto): Promise<number> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO pong (winner, p1, p1score, p2, p2score, start) VALUES(?, ?, ?, ?, ?, ?)";
			const	elements: number[] = pongAddDto.getTable();

			this.db.run(query, elements, function (this: StatementWithLastID, err: unknown) {
				if (err)
					return reject(err);

				resolve(this.lastID);
			});
		});
	}

	async getPongGameById(gameId: number): Promise<pongRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM pong WHERE id = ?";
			const	elements: number[] = [gameId];

			this.db.get(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: pong game ${gameId} doesn't exist`);
					return reject(new Error(`The pong game ${gameId} doesn't exist`));
				}

				resolve(new pongRespDto(row));
			});
		});
	}

	async isTaken(query: string, elements: Array<string>): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.db.get(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				resolve(!!row);
			});
		});
	}

	async deletePongGame(gameId: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query: string = "DELETE FROM pong WHERE id = ?";
			const	elements: number[] = [gameId];

			this.db.run(query, elements, function(err: unknown) {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}
}
