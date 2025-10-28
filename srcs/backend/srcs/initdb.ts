/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   initdb.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 21:13:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/28 21:44:18 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const	sqlite3 = require('sqlite3');

/* =================== SQLITE METHODS ===================

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

====================================================== */


export class	DB {
	private	db;
	private dbname;
	
	constructor(dbname: string) {
		this.dbname = '/app/dist/db/mydatabase.db';
		this.db = new sqlite3.Database(dbname, (err: string) => {
			if (err)
				console.error(err);
	
			console.log(`Database started on ${dbname}`);
		});
	}

	getUserById(id: number): any {
		
	}
}