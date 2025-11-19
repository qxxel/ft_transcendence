/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userTableBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:21:07 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:52:31 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'userRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	userTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS user (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		elo INTEGER
	);`);
}
