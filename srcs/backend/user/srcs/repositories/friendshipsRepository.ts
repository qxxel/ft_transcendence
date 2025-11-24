/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsRepository.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:45:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 18:25:08 by agerbaud         ###   ########.fr       */
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
import type { FriendUser }	from "../objects/friendUser.js"
import { NoRelationError } from "../utils/throwErrors.js"

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
			const	query = `INSERT INTO friendships (requester_id, receiver_id) 
					VALUES (?, ?)
				RETURNING *;`;
			const	elements: number[] = friendship.getTable();

			this.db.get(query, elements, (err: unknown, row: any) => {
				if (err)
					return reject(err);

				resolve(new friendshipsRespDto(row));
			});
		});
	}

	async acceptFriendRequest(friendship: friendshipsUpdateDto): Promise<friendshipsRespDto> {
		return new Promise((resolve, reject) => {
			const	query = `UPDATE friendships
					SET status = 'ACCEPTED'
					WHERE requester_id = ? AND receiver_id = ? AND status = 'PENDING'
				RETURNING *;`;
			const	elements: number[] = friendship.getTable();

			this.db.get(query, elements, (err: unknown, row: any) => {
				if (err)
					return reject(err);

				if (!row)
					return reject(new Error("You can't accept this request because it doesn't exist."))

				resolve(new friendshipsRespDto(row));
			});
		});
	}

	async removeRelation(userIdA: number, userIdB: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query: string = `DELETE FROM friendships
				WHERE (requester_id = ? AND receiver_id = ?) 
				OR (requester_id = ? AND receiver_id = ?)`;
			const	elements: number[] = [userIdA, userIdB, userIdB, userIdA];

			this.db.run(query, elements, function(err: unknown) {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async blockUser(friendship: friendshipsAddDto): Promise<friendshipsRespDto> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				this.db.run("BEGIN TRANSACTION");

				const	deleteQuery: string = `DELETE FROM friendships 
					WHERE (requester_id = ? AND receiver_id = ?) 
					OR (requester_id = ? AND receiver_id = ?);`;
				const	elements: number[] = friendship.getCheckTable();
			
				this.db.run(deleteQuery, elements, (err: unknown) => {
					if (err)
					{
						this.db.run("ROLLBACK");
						return reject(err);
					}
				
					const	insertQuery: string = `INSERT INTO friendships (requester_id, receiver_id, status) 
							VALUES (?, ?, 'BLOCKED')
						RETURNING *;`;
					const	insertElements: number[] = friendship.getTable();
				
					this.db.get(insertQuery, insertElements, (err: unknown, row: any) => {
						if (err) 
						{
							this.db.run("ROLLBACK");
							return reject(err);
						}
					
						this.db.run("COMMIT");
					
						resolve(new friendshipsRespDto(row));
					});
				});
			});
		});
	}

	async getRelationStatus(elements: number[]): Promise<{ status: string, requester_id: number | string } | null> {
		return new Promise((resolve, reject) => {
			const query: string = `SELECT status, requester_id FROM friendships 
					WHERE (requester_id = ? AND receiver_id = ?) 
					OR (requester_id = ? AND receiver_id = ?)
				LIMIT 1;`;

			this.db.get(query, elements, (err: unknown, row: any) => {
				if (err)
					return reject(err);

				if (!row)
					return resolve(null);

				return resolve(row);
			})
		});
	}

	async getFriendsList(userId: number): Promise<FriendUser[]> {
		return new Promise((resolve, reject) => {
			const query = `SELECT u.id, u.username, u.avatar, u.email
				FROM friendships f
				INNER JOIN users u ON u.id = CASE
					WHEN f.requester_id = ? THEN f.receiver_id -- Si je suis requester, je veux le receiver
					ELSE f.requester_id                        -- Sinon, je veux le requester
				END
				WHERE (f.requester_id = ? OR f.receiver_id = ?)
				AND f.status = 'ACCEPTED';`;
			const elements = [userId, userId, userId];
		
			this.db.all(query, elements, (err: unknown, rows: FriendUser[]) => {
				if (err)
					return reject(err);

				resolve(rows);
			});
		});
	}
}
