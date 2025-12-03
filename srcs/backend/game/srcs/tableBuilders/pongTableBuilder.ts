/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongTableBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 18:44:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 13:53:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'pongRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	pongTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS pong (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		id_client INTEGER NOT NULL,
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
