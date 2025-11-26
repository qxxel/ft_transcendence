/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tankRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 20:32:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF TANK DB AND HANDLE CLASSIC METHODS OF THIS DB


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { tankAddDto }		from "../dtos/tankAddDto.js"
import { tankRespDto }		from "../dtos/tankRespDto.js"
import { tankTableBuilder }	from "../tableBuilders/tankTableBuilder.js"

import type { Database }	from 'sqlite3'

/* ====================== INTERFACE	====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
interface	StatementWithLastID {
	lastID: number;
}


/* ====================== CLASS ====================== */

export class	tankRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			tankTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	async addTankGame(tankAddDto: tankAddDto): Promise<number> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO tank (winner, p1, p1kill, p2, p2kill, p3, p3kill, p4, p4kill, start) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			const	elements: number[] = tankAddDto.getTable();

			this.db.run(query, elements, function (this: StatementWithLastID, err: unknown) {
				if (err)
					return reject(err);

				resolve(this.lastID);
			});
		});
	}

	async getTankGameById(gameId: number): Promise<tankRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM tank WHERE id = ?";
			const	elements: number[] = [gameId];

			this.db.get(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: tank game ${gameId} doesn't exist`);
					return reject(new Error(`The tank game ${gameId} doesn't exist`));
				}

				resolve(new tankRespDto(row));
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

	async deleteTankGame(gameId: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query: string = "DELETE FROM tank WHERE id = ?";
			const	elements: number[] = [gameId];

			this.db.run(query, elements, function(err: unknown) {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}


	// GETTER
	getDb(): Database {
		return this.db;
	}
}
