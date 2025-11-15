/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtTableBuilder.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:08:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/15 23:08:40 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD JWT TABLE (CALLED IN 'jwtRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3';


/* ====================== FUNCTIONS ====================== */

export function	jwtTableBuilder(db: Database) {
	db.exec(`CREATE TABLE IF NOT EXISTS jwt (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		id_client INT NOT NULL,
		token TEXT NOT NULL UNIQUE
	);`);
}
