/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userBuilder.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:19:05 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/29 12:53:46 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


// WILL BUILD USER TABLE (CALLED IN 'userRepository')


/* ====================== IMPORT ====================== */

import { Database } from 'sqlite3'


/* ====================== FUNCTIONS ====================== */

export function	userTableBuilder(db: Database) {
	db.exec(`CREATE TABLE IF NOT EXISTS usr_user (
    	usr_spkuser INTEGER PRIMARY KEY AUTOINCREMENT,
    	usr_cname TEXT NOT NULL UNIQUE,
    	usr_cemail TEXT NOT NULL UNIQUE,
    	usr_cpasswordhashed TEXT NOT NULL,
    	usr_ielo INTEGER
	);`);
}
