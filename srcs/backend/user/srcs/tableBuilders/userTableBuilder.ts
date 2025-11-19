/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userBuilder.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:21:07 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/14 21:56:54 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'userRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3';


/* ====================== FUNCTIONS ====================== */

export function	userTableBuilder(db: Database) {
	db.exec(`CREATE TABLE IF NOT EXISTS user (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		elo INTEGER
	);`);
}
