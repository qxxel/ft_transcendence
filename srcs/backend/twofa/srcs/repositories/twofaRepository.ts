/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofaRepository.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:11:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/12 22:25:22 by mreynaud         ###   ########.fr       */
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

import { twofaTableBuilder }	from "../tableBuilders/twofaTableBuilder.js"

import type { Database }	from 'sqlite3'


/* ====================== class	====================== */

export class	twofaRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			twofaTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	async addOtp(id: number, otpSecretKey: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO twofa (id_client, otpSecretKey) VALUES(?, ?)";
			const	elements: [number, string] = [id, otpSecretKey];

			this.db.run(query, elements, (err: unknown) => {
				if (err)
					return reject(err);

				return resolve();
			});
		});
	}

	async getOtpSecretKeyByIdClient(id: number): Promise<string | null> {
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT otpSecretKey FROM twofa WHERE id_client = ?";
			const	elements: number[] = [id];

			this.db.get(query, elements, (err: unknown, row: any) => {
				if (err)
					return reject(err);

				if(!row || typeof row.otpSecretKey !== "string")
					return reject(null);

				return resolve(row.otpSecretKey);
			});
		});
	}

	async deleteOtpByIdClient(id: number): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "DELETE FROM twofa WHERE id_client = ?";
			const	elements: number[] = [id];

			this.db.run(query, elements, (err: unknown) => {
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
