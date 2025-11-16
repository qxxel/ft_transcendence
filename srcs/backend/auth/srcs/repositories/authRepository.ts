/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:11:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/16 22:32:40 by mreynaud         ###   ########.fr       */
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

import { authTableBuilder }	from "../tableBuilders/authTableBuilder.js"

import type { Database }	from 'sqlite3'


/* ====================== CLASS ====================== */

export class	authRepository {
	private	db: Database;

	constructor(db: any) {
		try {
			this.db = db;
			authTableBuilder(db);
		}
		catch (err) {
			console.error(err);
			process.exit(1);
		}
	}

	async addClient(id: string, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query = `INSERT INTO auth (id_client, password) VALUES(?, ?)`;
			const	elements = [id, password];
			this.db.run(query, elements, function (err) {
				if (err)
					return reject(err);
				return resolve();
			});
		});
	}

	async getClient(id: string): Promise<string>{
		return new Promise((resolve, reject) => {
			const	query = `SELECT * FROM user WHERE id_client = ?`;
			const	elements = [id];
			this.db.get(query, elements, (err, row: string) => {
				if (err)
					return reject(err);
				return resolve(row);
			});
		});
	}

	async deleteClient(id: string): Promise<void>{
		return new Promise((resolve, reject) => {
			const	query = `DELETE FROM user WHERE id = ?`;
			const	elements = [id];
			this.db.run(query, elements, function(err) {
				if (err)
					return reject(err);
				return resolve();
			});
		});
	}

	// GETTER
	getDb(): Database {
		return this.db;
	}
}
