/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsRepository.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:45:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 16:35:25 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF FRIENDSHIPS TABLE


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

import { friendshipsAddDto }			from "../dtos/friendshipsAddDto.js"
import { friendshipsRespDto }			from "../dtos/friendshipsRespDto.js"
import { friendshipsTableBuilder }	from "../tableBuilders/friendshipsTableBuilder.js"

import type { Database }	from 'sqlite3'

/* ====================== INTERFACE ====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
// interface	StatementWithLastID {
// 	lastID: number;
// }


/* ====================== CLASS ====================== */

export class	friendshipsRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			friendshipsTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	// UPDATE STATS
	
}
