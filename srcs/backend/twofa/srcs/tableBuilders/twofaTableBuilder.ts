/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofaTableBuilder.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:03:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/12 20:08:54 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD twofa TABLE (CALLED IN 'twofaRepository')


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	twofaTableBuilder(db: Database): void {
	db.exec(`CREATE TABLE IF NOT EXISTS twofa (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		id_client INT NOT NULL UNIQUE,
		otpSecretKey TEXT NOT NULL,
	);`);
}
