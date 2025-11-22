/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStatsTrigger.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/22 17:05:41 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 17:49:03 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BUILD TRIGGER BETWEEN USER TABLE AND USER STATS TABLE


/* ====================== IMPORT ====================== */

import type { Database }	from 'sqlite3'


/* ====================== FUNCTION ====================== */

export function	userStatsTrigger(db: Database): void {
	db.exec(`CREATE TRIGGER IF NOT EXISTS create_stats_after_signup
		AFTER INSERT ON users
		BEGIN
			INSERT INTO user_stats (user_id)
			VALUES (NEW.id);
		END
	;`);
}
