/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersTableBuilder.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:21:07 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 16:42:42 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'usersRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	usersTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		avatar TEXT,
		is_2fa_enable BOOLEAN DEFAULT FALSE
	);`);
}
