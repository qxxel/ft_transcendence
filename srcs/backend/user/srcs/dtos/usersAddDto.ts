/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersAddDto.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:51:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 19:01:18 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW USERS


/* ====================== IMPORTS ====================== */

import { isValidName, isValidEmail }	from "../utils/validation.js"
import { ValidationError }				from "../utils/throwErrors.js"

import type { validationResult }	from "../utils/validation.js"


/* ====================== CLASS ====================== */

export class	usersAddDto {
	private	username: string;
	private	email: string;
	private	avatar: string | null;

	constructor(row: any) {
		this.username = row.username;
		this.email = row.email;
		if (row.avatar)
			this.avatar = row.avatar;
		this.avatar = null;

		let	validation: validationResult = this.isValid()
		if (!validation.result)
			throw new ValidationError(validation.error);
	}

	isValid(): validationResult {
		const	nameResult: validationResult = isValidName(this.username);
		const	emailResult: validationResult = isValidEmail(this.email);

		const	errors: string | undefined = [nameResult.error, emailResult.error]
			.filter(error => error && error.length > 0)
			.join("; ");

		return { result: errors.length === 0, error: errors }
	}


	// GETTERS
	getTable(): [string, string, string | null] {
		return [
			this.username,
			this.email,
			this.avatar
		];
	}

	getName(): string {
		return this.username;
	}

	getEmail(): string {
		return this.email;
	}
}
