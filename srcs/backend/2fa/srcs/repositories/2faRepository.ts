/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   2faRepository.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:11:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/20 04:55:43 by mreynaud         ###   ########.fr       */
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

import { twofaTableBuilder }	from "../tableBuilders/2faTableBuilder.js"

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

	async addOtp(id: string, otpSecretKey: string, otp: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const	query: string = "INSERT INTO twofa (id_client, otpSecretKey, otp) VALUES(?, ?, ?)";
			const	elements: string[] = [id, otpSecretKey, otp];

			this.db.run(query, elements, function (err: unknown) {
				if (err)
					return reject(err);

				return resolve();
			});
		});
	}

	async getOtpByIdClient(id: string): Promise<string>{
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT otp FROM twofa WHERE id_client = ?";
			const	elements: string[] = [id];

			this.db.get(query, elements, (err: unknown, row: { password: string }) => {
				if (err)
					return reject(err);

				return resolve(row.password);
			});
		});
	}

	async getOtpSecretKeyByIdClient(id: string): Promise<string>{
		return new Promise((resolve, reject) => {
			const	query: string = "SELECT otpSecretKey FROM twofa WHERE id_client = ?";
			const	elements: string[] = [id];

			this.db.get(query, elements, (err: unknown, row: { password: string }) => {
				if (err)
					return reject(err);

				return resolve(row.password);
			});
		});
	}

	async deleteOtpByIdClient(id: string): Promise<void>{
		return new Promise((resolve, reject) => {
			const	query: string = "DELETE FROM twofa WHERE id = ?";
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
