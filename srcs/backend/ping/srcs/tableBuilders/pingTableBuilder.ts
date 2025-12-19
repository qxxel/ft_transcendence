/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pingTableBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:03:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:50:46 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD PING TABLE (CALLED IN 'pingRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	pingTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS ping (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		id_client INT NOT NULL UNIQUE,
		last_seen INTEGER NOT NULL
	);`);
}
