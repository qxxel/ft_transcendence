/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtTableBuilder.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:08:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:44:00 by agerbaud         ###   ########.fr       */
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
		creationtime TIMESTAMP NOT NULL
	);`);
}
