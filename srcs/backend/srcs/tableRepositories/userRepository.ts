/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 21:13:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/29 19:02:24 by agerbaud         ###   ########.fr       */
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

import	{ userTableBuilder } from '../tableBuilders/userBuilder.js'
import	{ userDto } from '../dtos/userDto.js'


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

	addUser(userDto: userDto): number {
		const user = this.db.run(`INSERT INTO usr_user (usr_cname, usr_cemail, usr_cpasswordhashed, usr_ielo) VALUES(?, ?, ?, ?)`,
			[userDto.getName(), userDto.getEmail(), userDto.getPwd(), 400]);
		return user.lastInsertRowid as number;
	}

	getUserById(userId: number): userDto {
		var	row = this.db.get(`SELECT * FROM usr_user WHERE usr_spkuser = VALUE(?)`, [userId]);
		if (!row)
			console.error(`error: user ${userId} doesn't exist`);
		return new userDto(row);
	}

	deleteUser(userId: number): void {
		this.db.run(`DELETE FROM usr_user WHERE usr_spkuser = VALUE(?)`, [userId]);
	}
}
