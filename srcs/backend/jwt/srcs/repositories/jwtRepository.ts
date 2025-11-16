/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtRepository.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:50:30 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/15 23:52:03 by agerbaud         ###   ########.fr       */
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

import type { Database }	from 'sqlite3'


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


	// GETTER
	getDb(): Database {
		return this.db;
	}
}
