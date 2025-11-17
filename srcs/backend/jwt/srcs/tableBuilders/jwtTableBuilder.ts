/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtTableBuilder.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:08:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 18:27:03 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD JWT TABLE (CALLED IN 'jwtRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3';


/* ====================== FUNCTIONS ====================== */

export function	jwtTableBuilder(db: Database) {
	db.exec(`CREATE TABLE IF NOT EXISTS jwt (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		idclient INT NOT NULL,
		token TEXT NOT NULL UNIQUE,
		creationtime TIMESTAMP NOT NULL
	);`);
}
