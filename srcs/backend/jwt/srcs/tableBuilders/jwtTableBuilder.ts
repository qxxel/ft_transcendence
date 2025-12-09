/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtTableBuilder.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:08:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 18:44:21 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD JWT TABLE (CALLED IN 'jwtRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	jwtTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS jwt (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		idclient INT NOT NULL,
		token TEXT NOT NULL UNIQUE,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
		expires_at DATETIME DEFAULT (datetime('now', '+1 day')) NOT NULL
	);`);
}
