/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userBuilder.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:19:05 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/03 23:06:00 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


// WILL BUILD USER TABLE (CALLED IN 'userRepository')


/* ====================== IMPORT ====================== */

import { Database } from 'sqlite3'


/* ====================== FUNCTIONS ====================== */

export function	userTableBuilder(db: Database) {
	db.exec(`CREATE TABLE IF NOT EXISTS user (
    	user INTEGER PRIMARY KEY AUTOINCREMENT,
    	username TEXT NOT NULL UNIQUE,
    	email TEXT NOT NULL UNIQUE,
    	password TEXT NOT NULL,
    	elo INTEGER
	);`);
}
