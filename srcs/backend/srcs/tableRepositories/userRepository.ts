/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRepository.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 21:13:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/28 22:20:21 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// will be the storage of db and handle classic methods of the db (getUser, deleteUser and addUser)

import	{ db } from '../index.js'


/* =================== SQLITE METHODS ===================

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

====================================================== */


export class	userRepository {
	private	db;
	
	constructor(db: any) {
		this.db = db;
	}

	getUserById(id: number): any {
		
	}
}