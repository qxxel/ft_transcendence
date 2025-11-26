/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersRepository.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:20:14 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF USERS TABLE


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { usersAddDto }			from "../dtos/usersAddDto.js"
import { usersRespDto }			from "../dtos/usersRespDto.js"
import { usersTableBuilder }	from "../tableBuilders/usersTableBuilder.js"

import type { Database }	from 'sqlite3'

/* ====================== interface	====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
interface	StatementWithLastID {
    lastID: number;
}


/* ====================== CLASS ====================== */

export class	usersRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			usersTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	async addUser(user: usersAddDto): Promise<number> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO users (username, email, elo) VALUES(?, ?, ?)";
			const	elements: [string, string, string | null] = user.getTable();

			this.db.run(query, elements, function (this: StatementWithLastID, err: unknown) {
				if (err)
					return reject(err);

				resolve(this.lastID);
			});
		});
	}

	async getUserById(userId: number): Promise<usersRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM users WHERE id = ?";
			const	elements: number[] = [userId];
			this.db.get(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: user ${userId} doesn't exist`);
					return reject(new Error(`The user ${userId} doesn't exist`));
				}

				resolve(new usersRespDto(row));
			});
		});
	}

	async getUserByUsername(username: string): Promise<usersRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM users WHERE username = ?";
			const	elements: string[] = [username];

			this.db.get(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: user ${username} doesn't exist.`);
					return reject(new Error(`The user ${username} doesn't exist.`));
				}

				resolve(new usersRespDto(row));
			});
		});
	}

	async getUserByEmail(email: string): Promise<usersRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT * FROM users WHERE email = ?";
			const	elements: string[] = [email];

			this.db.get(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: user ${email} doesn't exist.`);
					return reject(new Error(`The user ${email} doesn't exist.`));
				}

				resolve(new usersRespDto(row));
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
			const	query: string = "DELETE FROM users WHERE id = ?";
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
