/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:20:14 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:42:18 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF THE DB (`getUser`, "DELETEUser` AND `addUser`)


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { userAddDto }		from "../dtos/userAddDto.js"
import { userRespDto }		from "../dtos/userRespDto.js"
import { userTableBuilder }	from "../tableBuilders/userTableBuilder.js"

import type { Database }	from 'sqlite3'

/* ====================== INTERFACE ====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
interface	StatementWithLastID {
    lastID: number;
}


/* ====================== CLASS ====================== */

export class	userRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			userTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	async addUser(userAddDto: userAddDto): Promise<number> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO user (username, email, elo) VALUES(?, ?, ?)";
			const	elements: [string, string, number] = [userAddDto.getName(), userAddDto.getEmail(), 400];

			this.db.run(query, elements, function (this: StatementWithLastID, err: unknown) {
				if (err)
					return reject(err);

				resolve(this.lastID);
			});
		});
	}

	async getUserById(userId: number): Promise<userRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM user WHERE id = ?";
			const	elements: number[] = [userId];
			this.db.get(query, elements, (err: unknown, row: unknown) => {
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
			const	query: string = "SELECT * FROM user WHERE username = ?";
			const	elements: string[] = [username];

			this.db.get(query, elements, (err: unknown, row: unknown) => {
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
			const	query: string = "SELECT * FROM user WHERE email = ?";
			const	elements: string[] = [email];

			this.db.get(query, elements, (err: unknown, row: unknown) => {
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

	async isTaken(query: string, elements: Array<string>): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.db.get(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				resolve(!!row);
			});
		});
	}

	async deleteUser(userId: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query: string = "DELETE FROM user WHERE id = ?";
			const	elements: number[] = [userId];

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
