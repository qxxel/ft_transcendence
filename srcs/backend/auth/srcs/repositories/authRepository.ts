/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:11:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 23:59:49 by mreynaud         ###   ########.fr       */
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

	async addClient(id: number, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO auth (id_client, password) VALUES(?, ?)";
			const	elements: [number, string] = [id, password];

			this.db.run(query, elements, (err: Error | null) => {
				if (err)
					return reject(err);

				return resolve();
			});
		});
	}

	async getPasswordByIdClient(id: number): Promise<string | null>{
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT password FROM auth WHERE id_client = ?";
			const	elements: number[] = [id];

			this.db.get(query, elements, (err: Error | null, row: any) => {
				if (err)
					return reject(err);

				if(!row || typeof row.password !== "string")
					return reject(null);

				return resolve(row.password);
			});
		});
	}

	getExpiredClients(): Promise<number[]> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT id_client FROM auth WHERE expires_at IS NOT NULL";

			this.db.all( query, (err: Error | null, rows: any[]) => {
				if (err)
					return reject(err);

				const	ids: number[] = rows
					.map(r => Number(r.id_client))
					.filter((id: number) => !isNaN(id));
				resolve(ids);
			});
		});
	}
	
	async getExpiresByIdClient(id: number): Promise<number | null>{
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT expires_at FROM auth WHERE id_client = ?";
			const	elements: number[] = [id];

			this.db.get(query, elements, (err: Error | null, row: any) => {
				if (err)
					return reject(err);
				if(!row || typeof row.expires_at !== "string")
					return resolve(null);
				return resolve((new Date(row.expires_at)).getTime());
			});
		});
	}

	async updateExpiresByIdClient(userId: number, expires_at: string | null): Promise<void> {
		return new Promise((resolve, reject) => {
			let	query: string;
			let	elements: [string, number] | [number];
			if (expires_at === null) {
				query = "UPDATE auth SET expires_at = NULL WHERE id_client = ?";
				elements = [userId];
			} else {
				query = "UPDATE auth SET expires_at = ? WHERE id_client = ?";
				elements = [expires_at, userId];
			}
			this.db.run(query, elements, (err: Error | null) => {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async deleteClient(id: number): Promise<void>{
		return new Promise((resolve, reject) => {
			const	query: string = "DELETE FROM auth WHERE id_client = ?";
			const	elements: number[] = [id];

			this.db.run(query, elements, (err: Error | null) => {
				if (err)
					return reject(err);

				return resolve();
			});
		});
	}
}
