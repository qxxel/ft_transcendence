/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:20:14 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/15 19:03:46 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF THE DB (`getUser`, `deleteUser` AND `addUser`)


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'

import { userTableBuilder }	from '../builders/userBuilder.js';
import { userAddDto }		from '../dtos/userAddDto.js'
import { userRespDto }		from '../dtos/userRespDto.js';

/* ====================== INTERFACE ====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
interface	StatementWithLastID {
    lastID: number;
}


/* ====================== CLASS ====================== */

export class	userRepository {
	private	db: Database;

	constructor(db: any) {
		try {
			this.db = db;
			userTableBuilder(db);
		}
		catch (err) {
			console.error(err);
			process.exit(1);
		}
	}

	async addUser(userAddDto: userAddDto): Promise<number> {
		return new Promise((resolve, reject) => {
			const	query = `INSERT INTO user (username, email, elo) VALUES(?, ?, ?)`;
			const	elements = [userAddDto.getName(), userAddDto.getEmail(), 400];
			this.db.run(query, elements, function (this: StatementWithLastID, err) {
				if (err)
					return reject(err);

				resolve(this.lastID);
			});
		});
	}

	async getUserById(userId: number): Promise<userRespDto> {
		return new Promise((resolve, reject) => {
			const	query = `SELECT * FROM user WHERE id = ?`;
			const	elements = [userId];
			this.db.get(query, elements, (err, row) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: user ${userId} doesn't exist`);
					return reject(new Error(`The user ${userId} doesn't exist`));
				}

				resolve(new userRespDto(row));
			});
		});
	}

	async getUserByUsername(username: string): Promise<userRespDto> {
		return new Promise((resolve, reject) => {
			const	query = `SELECT * FROM user WHERE username = ?`;
			const	elements = [username];
			this.db.get(query, elements, (err, row) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: user ${username} doesn't exist.`);
					return reject(new Error(`The user ${username} doesn't exist.`));
				}

				resolve(new userRespDto(row));
			});
		});
	}

	async getUserByEmail(email: string): Promise<userRespDto> {
		return new Promise((resolve, reject) => {
			const	query = `SELECT * FROM user WHERE email = ?`;
			const	elements = [email];
			this.db.get(query, elements, (err, row) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: user ${email} doesn't exist.`);
					return reject(new Error(`The user ${email} doesn't exist.`));
				}

				resolve(new userRespDto(row));
			});
		});
	}

	async deleteUser(userId: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			console.log("5");
			const	query = `DELETE FROM user WHERE id = ?`;
			const	elements = [userId];
			this.db.run(query, elements, function(err) {
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
