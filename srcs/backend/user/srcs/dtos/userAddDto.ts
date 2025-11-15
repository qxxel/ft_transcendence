/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userAddDto.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:51:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/15 17:30:20 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW USERS


/* ====================== IMPORTS ====================== */

import { isValidName, isValidEmail } from "../utils/validation.js"
import { ValidationError } from "../utils/throwErrors.js"

import type { validationResult } from "../utils/validation.js";

/* ====================== CLASS ====================== */

export class	userAddDto {
	private	username: string;
	private	email: string;

	constructor(row: any) {
		this.username = row.username;
		this.email = row.email;

		var validation = this.isValid()
		if (!validation.result)
			throw new ValidationError(validation.error);
	}

	isValid(): validationResult {
		const	nameResult = isValidName(this.username);
		const	emailResult = isValidEmail(this.email);

		const	errors = [nameResult.error, emailResult.error]
			.filter(error => error && error.length > 0)
			.join("; ");

		return { result: errors.length === 0, error: errors } // change to send error by error
	}


	// GETTERS
	getName(): string {
		return this.username;
	}

	getEmail(): string {
		return this.email;
	}
}
