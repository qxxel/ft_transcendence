/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tankTableBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 20:37:44 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 20:40:45 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'tankRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	tankTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS tank (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		winner INTEGER NOT NULL UNIQUE,
		p1 INTEGER NOT NULL,
		p1kill INTEGER NOT NULL,
		p2 INTEGER,
		p2kill INTEGER NOT NULL,
		p3 INTEGER,
		p3kill INTEGER NOT NULL,
		p4 INTEGER,
		p4kill INTEGER NOT NULL,
		start TIMESTAMP NOT NULL
	);`);
}
