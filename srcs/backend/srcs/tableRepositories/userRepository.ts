/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 21:13:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/29 12:56:17 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE STORAGE OF DB AND HANDLE CLASSIC METHODS OF THE DB (`getUser`, `deleteUser` AND `addUser`)

/* =================== SQLITE METHODS =================== /*

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

/* ====================================================== */


/* ====================== IMPORT ====================== */

import	{ db } from '../index.js'
import	{ userTableBuilder } from '../tableBuilders/userBuilder.js'


/* ====================== CLASS ====================== */

export class	userRepository {
	private	db;
	
	constructor(db: any) {
		try {
			this.db = db;
			userTableBuilder(db);
		}
		catch (err) {
			console.error(err);
			process.exit(1);
		}
	}

	getUserById(id: number): any {
		
	}
}