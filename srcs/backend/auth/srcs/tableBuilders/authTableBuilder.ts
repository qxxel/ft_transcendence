/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authTableBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:03:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:50:14 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD AUTH TABLE (CALLED IN 'authRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	authTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS auth (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		id_client INT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`);
}
