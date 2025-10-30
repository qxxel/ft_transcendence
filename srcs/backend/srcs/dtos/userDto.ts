/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userDto.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:18:37 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/30 18:15:36 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// will be a data trasfert object (to send variables between back and front)

/* ====================== IMPORT ====================== */

import { validationResult, isValidName, isValidPwd } from '../utils/validation.js'


/* ====================== CLASS ====================== */

export class	userDto {
	private	name: string;
	private	email: string;
	private	pwdHashed: string;
	private	elo?: number;

	constructor(row: any) {
		this.name = row.usr_cname;
		this.email = row.usr_cemail;
		this.pwdHashed = row.usr_cpasswordhashed;
		if (row.usr_ielo)
			this.elo = row.usr_ielo;

		var validation = this.isValid()
		if (!validation.result)
			throw new Error(validation.error);
	}

	isValid(): validationResult {
		const	nameResult = isValidName(this.name);
		const	pwdResult = isValidPwd(this.pwdHashed);

		const	errors = [nameResult.error, pwdResult.error]
			.filter(error => error && error.length > 0)
			.join(", ");

		return { result: errors.length === 0, error: errors }
	}


	// GETTERS
	getName(): string {
		return this.name;
	}

	getEmail(): string {
		return this.email;
	}

	getPwd(): string {
		return this.pwdHashed;
	}

	getElo(): number {
		return this.elo!;
	}
}
