/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsRepository.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 16:47:32 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:18:59 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF USER STATS TABLE


/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORTS ====================== */

// import { userStatsAddDto }			from "../dtos/userStatsAddDto.js"
// import { userStatsRespDto }			from "../dtos/userStatsRespDto.js"
import { userStatsTableBuilder }	from "../tableBuilders/userStatsTableBuilder.js"

import type { Database }	from 'sqlite3'

/* ====================== INTERFACE ====================== */

// BECAUSE TYPESCRIPT DON'T ACCEPT `this.lastID` BUT IT APPEARS WITH THE COMPILATION
// interface	StatementWithLastID {
// 	lastID: number;
// }


/* ====================== CLASS ====================== */

export class	userStatsRepository {
	private	db: Database;

	constructor(db: Database) {
		try {
			this.db = db;
			userStatsTableBuilder(db);
		}
		catch (err: unknown) {
			console.error(err);
			process.exit(1);
		}
	}

	// UPDATE STATS


	// GETTER
	getDb(): Database {
		return this.db;
	}
}
