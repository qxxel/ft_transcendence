/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userDto.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:18:37 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/05 10:50:44 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// will be a data trasfert object (to send variables between back and front)


/* ====================== IMPORT ====================== */

import { validationResult, isValidName, isValidPwd } from '../utils/validation.js'


/* ====================== CLASS ====================== */

export class	userDto {
	private	username: string;
	private	email: string;
	private	password: string;
	private	elo?: number;

	constructor(row: any) {
		this.username = row.username;
		this.email = row.email;
		this.password = row.password;
		if (row.elo)
			this.elo = row.elo;

		var validation = this.isValid()
		if (!validation.result)
			throw new Error(validation.error);
	}

	isValid(): validationResult {
		const	nameResult = isValidName(this.username);
		const	pwdResult = isValidPwd(this.password);

		const	errors = [nameResult.error, pwdResult.error]
			.filter(error => error && error.length > 0)
			.join(", ");

		return { result: errors.length === 0, error: errors }
	}


	// GETTERS
	getName(): string {
		return this.username;
	}

	getEmail(): string {
		return this.email;
	}

	getPwd(): string {
		return this.password;
	}

	getElo(): number {
		return this.elo!;
	}
}
