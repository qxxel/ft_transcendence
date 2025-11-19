/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtRepository.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:30 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 23:37:03 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF THE DB


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORT ====================== */

import { jwtTableBuilder }	from "../tableBuilders/jwtTableBuilder.js"
import { jwtRespDto }		from "../dtos/jwtRespDto.js";

import type { Database }	from 'sqlite3'


/* ====================== INTERFACE ====================== */

interface	StatementWithLastID {
	lastID: number
};


/* ====================== CLASS ====================== */

export class	jwtRepository {
	private	db: Database;

	constructor(db: any) {
		try {
			this.db = db;
			jwtTableBuilder(db);
		}
		catch (err) {
			console.error(err);
			process.exit(1);
		}
	}

	async addToken(token: string, clientId: number): Promise<number> {
		return new Promise((resolve, reject) => {
			let	currentTimestamp = Date.now();

			console.log(clientId);
			console.log(token);
			console.log(currentTimestamp);
			
			const	query = `INSERT INTO jwt (idclient, token, creationtime) VALUES(?, ?, ?)`;
			const	elements = [clientId, token, currentTimestamp];
			this.db.run(query, elements, function (this: StatementWithLastID, err) {
				if (err)
					return reject(err);

				resolve(this.lastID);
			});
		});
	}

	async getClientIdByToken(token: string): Promise<jwtRespDto> {
		return new Promise((resolve, reject) => {
			const	query: string = `SELECT * FROM jwt WHERE token = ?`;
			const	elements: string[] = [token];
			this.db.get(query, elements, (err, row) => {
				if (err)
					return reject(err);

				if (!row) {
					console.error(`error: the token isn't liked to a client.`);
					return reject(new Error(`The token isn't liked to a client.`));
				}

				resolve(new jwtRespDto(row));
			});
		});
	}

	async isValidToken(token: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const	query: string = `SELECT * FROM jwt WHERE token = ?`;
			const	elements: string[] = [token];
			this.db.get(query, elements, (err, row) => {
				if (err)
					return reject(err);

				resolve(!!row);
			});
		});
	}

	async deleteToken(token: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query = `DELETE FROM jwt WHERE token = ?`;
			const	elements = [token];
			this.db.run(query, elements, function(err) {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async deleteTokenById(token: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const	query = `DELETE FROM jwt WHERE idclient = ?`;
			const	elements = [token];
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
