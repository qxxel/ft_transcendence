/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authTableBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:03:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 17:36:05 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD AUTH TABLE (CALLED IN 'authRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3';


/* ====================== FUNCTIONS ====================== */

export function	authTableBuilder(db: Database) {
	db.exec(`CREATE TABLE IF NOT EXISTS auth (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		id_client INT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`);
}
