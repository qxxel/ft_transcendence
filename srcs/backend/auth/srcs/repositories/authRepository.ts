/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:11:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
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


/* ====================== IMPORTS ====================== */

import { authTableBuilder }	from "../tableBuilders/authTableBuilder.js"

import type { Database }	from 'sqlite3'


/* ====================== CLASS ====================== */

export class	authRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			authTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	async addClient(id: string, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO auth (id_client, password) VALUES(?, ?)";
			const	elements: string[] = [id, password];

			this.db.run(query, elements, function (err: unknown) {
				if (err)
					return reject(err);

				return resolve();
			});
		});
	}

	async getPasswordByIdClient(id: string): Promise<string>{
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT password FROM auth WHERE id_client = ?";
			const	elements: string[] = [id];

			this.db.get(query, elements, (err: unknown, row: { password: string }) => {
				if (err)
					return reject(err);

				return resolve(row.password);
			});
		});
	}

	async deleteClient(id: string): Promise<void>{
		return new Promise((resolve, reject) => {
			const	query: string = "DELETE FROM auth WHERE id = ?";
			const	elements: string[] = [id];

			this.db.run(query, elements, function(err: unknown) {
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
