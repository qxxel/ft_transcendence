/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userDto.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:18:37 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/29 17:17:08 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// will be a data trasfert object (to send variables between back and front)

/* ====================== IMPORT ====================== */

import { validationResult, isValidName, isValidPwd } from '../utils/validation.js'


/* ====================== INTERFACE ====================== */

// export interface	userDto {
// 	id: number,
// 	username: string,
// 	email: string,
// 	passwordHashed: string,
// 	elo: number
// };


/* ====================== CLASS ====================== */

export class	userDto {
	private id: number;
	private	name: string;
	private	email: string;
	private	pwdHashed: string;
	private	elo: number;

	constructor(row: any) {
		this.id = row.usr_spkuser;
		this.name = row.usr_cname;
		this.email = row.usr_cemail;
		this.pwdHashed = row.usr_cpasswordhashed;
		this.elo = row.usr_ielo;

		var validation = this.isValid()
		if (!validation.result)
			throw new Error(validation.error);
	}

	isValid(): validationResult {
		const	nameResult = isValidName(this.name);
		const	pwdResult = isValidPwd(this.pwdHashed);

		const	errors = [nameResult.error, pwdResult.error].join(", ");

		return { result: errors.length === 0, error: errors }
	}
}
