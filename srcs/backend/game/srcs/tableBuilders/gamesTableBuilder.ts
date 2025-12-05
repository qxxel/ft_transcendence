/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesTableBuilder.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:44:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 17:28:34 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'gamesRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

/* GUIDE ===================================

	* game_type => 1 for pong, 2 for tank

========================================= */

export function	gamesTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS games (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		id_client INTEGER NOT NULL,
		game_type INTEGER NOT NULL,
		winner INTEGER NOT NULL,
		p1 TEXT NOT NULL,
		p1score INTEGER NOT NULL,
		p2 TEXT NOT NULL,
		p2score INTEGER NOT NULL,
		mode TEXT NOT NULL,
		powerup BOOLEAN NOT NULL,
		start TIMESTAMP NOT NULL,
		duration INTEGER NOT NULL
	);`);
}
