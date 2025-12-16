/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsRepository.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 16:47:32 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 23:47:16 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF USER STATS TABLE


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { userStatsRespDto }			from "../dtos/userStatsRespDto.js"
import { userStatsPongUpdateDto }	from "../dtos/userStatsUpdateDto.js"
import { userStatsTankUpdateDto }	from "../dtos/userStatsUpdateDto.js"
import { userStatsTrigger }			from "../triggers/userStatsTrigger.js"
import { userStatsTableBuilder }	from "../tableBuilders/userStatsTableBuilder.js"

import type { Database }	from 'sqlite3'

/* ====================== CLASS ====================== */

export class	userStatsRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			userStatsTableBuilder(db);
			userStatsTrigger(db);

		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	// UPDATE PONG STATS
	async updatePongStats(userStatsUpdate: userStatsPongUpdateDto): Promise<userStatsRespDto> {
		return new Promise((resolve, reject) => {
			const	resultCol = userStatsUpdate.isWinner() ? "pong_wins" : "pong_losses";
			
			const	query: string = `UPDATE user_stats SET
					pong_elo = pong_elo + ?,
					${resultCol} = ${resultCol} + 1,
					pong_total_time = pong_total_time + ?,
					pong_points_marked = pong_points_marked + ?
				WHERE user_id = ? RETURNING *;`;
			const	elements: number[] = userStatsUpdate.getTable();

			this.db.get(query, elements, function (err: Error | null, row: unknown) {
				if (err)
					return reject(err);

				resolve(new userStatsRespDto(row));
			});
		});
	}

	// UPDATE TANK STATS
	async updateTankStats(userStatsUpdate: userStatsTankUpdateDto): Promise<userStatsRespDto> {
		return new Promise((resolve, reject) => {
			const	resultCol = userStatsUpdate.isWinner() ? "tank_wins" : "tank_losses";

			const	query: string = `UPDATE user_stats SET
					tank_elo = tank_elo + ?,
					${resultCol} = ${resultCol} + 1,
					tank_total_time = tank_total_time + ?,
					tank_kills = tank_kills + ?
				WHERE user_id = ? RETURNING *;`;
			const	elements: number[] = userStatsUpdate.getTable();

			this.db.run(query, elements, function (row: unknown, err: Error | null) {
				if (err)
					return reject(err);

				resolve(new userStatsRespDto(row));
			});
		});
	}

	async getStatsByUserId(userId: number): Promise<userStatsRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM user_stats WHERE user_id = ?";
			const	elements: [number] = [userId];

			this.db.get(query, elements, (err: Error | null, row: unknown) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: user ${userId} doesn't exist`);
					return reject(new Error(`The user ${userId} doesn't exist`));
				}

				resolve(new userStatsRespDto(row));
			});
		});
	}

	async isTaken(query: string, elements: Array<string>): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.db.get(query, elements, (err: Error | null, row: unknown) => {
				if (err)
					return reject(err);

				resolve(!!row);
			});
		});
	}
}
