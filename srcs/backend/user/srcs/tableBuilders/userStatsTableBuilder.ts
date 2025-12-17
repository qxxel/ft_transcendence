/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsTableBuilder.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 16:44:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 13:18:35 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'userStatsRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	userStatsTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS user_stats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL UNIQUE,

		pong_wins INTEGER DEFAULT 0,
		pong_losses INTEGER DEFAULT 0,
		pong_total_time INTEGER DEFAULT 0,
		pong_points_marked INTEGER DEFAULT 0,

		tank_wins INTEGER DEFAULT 0,
		tank_losses INTEGER DEFAULT 0,
		tank_total_time INTEGER DEFAULT 0,
		tank_kills INTEGER DEFAULT 0,

		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);`);
}
