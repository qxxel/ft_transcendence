/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersRepository.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:20:14 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/29 11:42:57 by mreynaud         ###   ########.fr       */
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

import { NotExistError }		from "../utils/throwErrors.js";
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
			const	query: string = "INSERT INTO users (username, email, avatar) VALUES(?, ?, ?)";
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
					return reject(new NotExistError(`The user ${userId} doesn't exist`));
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
					return reject(new NotExistError(`The user ${username} doesn't exist.`));
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
					return reject(new NotExistError(`The user ${email} doesn't exist.`));
				}

				resolve(new usersRespDto(row));
			});
		});
	}

	async updateUsernameById(userId: number, username: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "UPDATE users SET username = ? WHERE id = ?";
			const	elements: [string, number] = [username, userId];

			this.db.run(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async updateEmailById(userId: number, email: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "UPDATE users SET email = ? WHERE id = ?";
			const	elements: [string, number] = [email, userId];

			this.db.run(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async updateAvatarById(userId: number, avatar: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "UPDATE users SET avatar = ? WHERE id = ?";
			const	elements: [string, number] = [avatar, userId];

			this.db.run(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async update2faById(userId: number, is2faEnable: boolean): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "UPDATE users SET is_2fa_Enable = ? WHERE id = ?";
			const	elements: [boolean, number] = [is2faEnable, userId];

			this.db.run(query, elements, (err: unknown, row: unknown) => {
				if (err)
					return reject(err);

				resolve();
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
}
