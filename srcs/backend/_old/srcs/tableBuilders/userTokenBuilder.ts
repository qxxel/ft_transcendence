/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userTokenBuilder.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 12:49:45 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/06 13:41:47 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD USER TABLE (CALLED IN 'userTokenRepository')


/* ====================== IMPORT ====================== */

import { Database } from 'sqlite3'


/* ====================== FUNCTIONS ====================== */

export function	userTokenTableBuilder(db: Database) {
	db.exec(`CREATE TABLE IF NOT EXISTS userToken (
		id INTEGER FOREIGN KEY,
		token TEXT,
	);`);
}
