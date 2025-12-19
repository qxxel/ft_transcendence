/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesRepository.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:54:55 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 09:49:21 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF GAMES DB AND HANDLE CLASSIC METHODS OF THIS DB


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { gamesAddDto }			from "../dtos/gamesAddDto.js"
import { gamesRespDto }			from "../dtos/gamesRespDto.js"
import { gamesTableBuilder }	from "../tableBuilders/gamesTableBuilder.js"

import type { Database }	from 'sqlite3'
import type { GameUser }	from "../objects/gameUser.js"

/* ====================== interface	====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION /!\
interface	StatementWithLastID {
    lastID: number;
}


/* ====================== CLASS ====================== */

export class	gamesRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			gamesTableBuilder(db);
		}
		catch (error: unknown) {
			console.error(error);
			process.exit(1);
		}
	}

	async addGame(gameAddDto: gamesAddDto): Promise<number> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO games (id_client, game_type, winner, p1, p1score, p2, p2score, mode, powerup, start, duration) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			const	elements: [number, number, number, string, number, string, number, string, boolean, number, number] = gameAddDto.getTable();

			this.db.run(query, elements, function (this: StatementWithLastID, err: Error | null) {
				if (err)
					return reject(err);

				resolve(this.lastID);
			});
		});
	}

	async getGameById(gameId: number): Promise<gamesRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM games WHERE id = ?";
			const	elements: number[] = [gameId];

			this.db.get(query, elements, (err: Error | null, row: unknown) => {
				if (err)
					return reject(err);

				if (!row)
				{
					console.error(`error: game ${gameId} doesn't exist`);
					return reject(new Error(`The game ${gameId} doesn't exist`));
				}

				resolve(new gamesRespDto(row));
			});
		});
	}

	async getHistoryByClientId(userId: number): Promise<GameUser[]> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM games WHERE id_client = ?";
			const	elements: number[] = [userId];

			this.db.all(query, elements, (err: Error | null, rows: GameUser[]) => {
				if (err)
					return reject(err);

				resolve(rows);
			});
		});
	}

	async isTaken(query: string, elements: string[]): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.db.get(query, elements, (err: Error | null, row: unknown) => {
				if (err)
					return reject(err);

				resolve(!!row);
			});
		});
	}

	async deleteGame(gameId: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query: string = "DELETE FROM games WHERE id = ?";
			const	elements: number[] = [gameId];

			this.db.run(query, elements, function(err: Error | null) {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async deleteClientGames(userId: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query: string = "DELETE FROM games WHERE id_client = ?";
			const	elements: number[] = [userId];

			this.db.run(query, elements, function(err: Error | null) {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}
}
