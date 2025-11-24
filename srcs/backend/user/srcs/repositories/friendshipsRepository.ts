/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsRepository.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:45:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 13:48:03 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF FRIENDSHIPS TABLE


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { friendshipsAddDto }		from "../dtos/friendshipsAddDto.js"
import { friendshipsRespDto }		from "../dtos/friendshipsRespDto.js"
import { friendshipsTableBuilder }	from "../tableBuilders/friendshipsTableBuilder.js"
import { friendshipsUpdateDto }		from "../dtos/friendshipsUpdateDto.js"

import type { Database }	from 'sqlite3'

/* ====================== INTERFACE ====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
// interface	StatementWithLastID {
// 	lastID: number;
// }


/* ====================== CLASS ====================== */

export class	friendshipsRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			friendshipsTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	// UPDATE STATS
	async addFriendRequest(friendship: friendshipsAddDto): Promise<friendshipsRespDto> {
		return new Promise((resolve, reject) => {
			const	query = `INSERT INTO friendships (requester_id, receiver_id, status) 
					VALUES (?, ?, 'PENDING')
				RETURNING *;`;

			this.db.get(query, friendship.getTable(), (err: unknown, row: any) => {
				if (err)
					return reject(err);

				resolve(new friendshipsRespDto(row));
			});
		});
	}

	async acceptFriendRequest(friendship: friendshipsUpdateDto): Promise<friendshipsRespDto> {
		return new Promise((resolve, reject) => {
			const	query = `INSERT INTO friendships (requester_id, receiver_id, status) 
					VALUES (?, ?, 'PENDING')
				RETURNING *;`;

			this.db.get(query, friendship.getTable(), (err: unknown, row: any) => {
				if (err)
					return reject(err);

				resolve(new friendshipsRespDto(row));
			});
		});
	}

	async getRelationStatus(elements: number[]): Promise<string | null> {
		return new Promise((resolve, reject) => {
			const query: string = `SELECT 1 FROM friendships 
					WHERE (requester_id = ? AND receiver_id = ?) 
					OR (requester_id = ? AND receiver_id = ?)
				LIMIT 1;`;

			this.db.get(query, elements, (err: unknown, row: any) => {
				if (err)
					return reject(err);

				if (!row)
					return resolve(null);

				return resolve(row.status as string);
			})
		});
	}
}
