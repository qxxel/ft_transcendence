/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 21:13:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/04 15:58:58 by agerbaud         ###   ########.fr       */
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

import	{ userTableBuilder } from '../tableBuilders/userBuilder.js'
import	{ userDto } from '../dtos/userDto.js'
import	{ Database, Statement } from 'sqlite3'


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

	async addUser(userDto: userDto): Promise<number> {
		return new Promise((resolve, reject) => {
			const	query = `INSERT INTO user (username, email, password, elo) VALUES(?, ?, ?, ?)`;
			const	elements = [userDto.getName(), userDto.getEmail(), userDto.getPwd(), 400];
			this.db.run(query, elements, function (this: StatementWithLastID, err) {
				if (err)
					return reject(err + "1");

				resolve(this.lastID);
			});
		});
	}

	async getUserById(userId: number): Promise<userDto> {
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

				resolve(new userDto(row));
			});
		});
	}

	async getUserByUsername(username: string): Promise<userDto> {
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

				resolve(new userDto(row));
			});
		});
	}

	async getUserByEmail(email: string): Promise<userDto> {
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

				resolve(new userDto(row));
			});
		});
	}

	async deleteUser(userId: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
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
