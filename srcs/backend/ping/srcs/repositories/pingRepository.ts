/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pingRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:11:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:41:50 by mreynaud         ###   ########.fr       */
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

import { pingTableBuilder }	from "../tableBuilders/pingTableBuilder.js"

import type { Database }	from 'sqlite3'


/* ====================== CLASS ====================== */

export class	pingRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			pingTableBuilder(db);
		}
		catch (error: unknown) {
			console.error(error);
			process.exit(1);
		}
	}

	async addPing(idClient: number): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO ping (id_client, last_seen) VALUES(?, ?)";
			const	elements: number[] = [idClient, Date.now()];

			this.db.run(query, elements, (err: Error | null) => {
				if (err)
					return reject(err);

				return resolve();
			});
		});
	}

	async getLastSeenByIdClient(idClient: number): Promise<number | null>{
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT last_seen FROM ping WHERE id_client = ?";
			const	elements: number[] = [idClient];

			this.db.get(query, elements, (err: Error | null, row: any) => {
				if (err) {
					return reject(err);
				}

				if (!row) {
					return resolve(null);
				}

				return resolve(row.last_seen);
			});
		});
	}

	async getInactiveClient(): Promise<number[]>{
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT id_client FROM ping WHERE last_seen < ?";
			const	elements: number[] = [Date.now() - 30000]; // 30s

			this.db.all(query, elements, (err: Error | null, row: any[]) => {
				if (err) {
					return reject(err);
				}

				return resolve(row.map(r => r.id_client));
			});
		});
	}

	async updatePing(idClient: number, ): Promise<void> {
		return new Promise((resolve, reject) => {
			let	query: string = "UPDATE ping SET last_seen = ? WHERE id_client = ?";
			let	elements: number[] = [Date.now(), idClient];
			this.db.run(query, elements, (err: Error | null) => {
				if (err)
					return reject(err);

				resolve();
			});
		});
	}

	async deleteClient(idClient: number): Promise<void>{
		return new Promise((resolve, reject) => {
			const	query: string = "DELETE FROM ping WHERE id_client = ?";
			const	elements: number[] = [idClient];

			this.db.run(query, elements, (err: Error | null) => {
				if (err)
					return reject(err);

				return resolve();
			});
		});
	}
}
