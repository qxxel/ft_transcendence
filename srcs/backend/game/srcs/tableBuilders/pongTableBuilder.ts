/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongTableBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:44:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 19:17:49 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'pongRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	pongTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS pong (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		winner INTEGER NOT NULL UNIQUE,
		p1 INTEGER NOT NULL,
		p1score INTEGER NOT NULL,
		p2 INTEGER,
		p2score INTEGER NOT NULL,
		start TIMESTAMP NOT NULL
	);`);
}
