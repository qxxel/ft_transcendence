/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersUpdateDto.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:51:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/08 20:28:46 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR UPDATE USERS


/* ====================== IMPORTS ====================== */

import { isValidName, isValidEmail }	from "../utils/validation.js"
import { ValidationError }				from "../utils/throwErrors.js"
import { usersRespDto }					from "./usersRespDto.js"

import type { validationResult }	from "../utils/validation.js"


/* ====================== CLASS ====================== */

export class	usersUpdateDto {
	private	id: number;
	private	username?: string;
	private	email?: string;
	private	avatar?: string;
	private	is2faEnable?: boolean;

	constructor(row: any, oldUser: usersRespDto) {
		this.id = oldUser.getId();
		if (row.username != oldUser.getUsername())
			this.username = row.username || "";
		if (row.email != oldUser.getEmail())
			this.email = row.email || "";
		if (row.avatar != oldUser.getAvatar())
			this.avatar = row.avatar;
		if (row.is2faEnable != oldUser.getIs2faEnable())
			this.is2faEnable = row.is2faEnable;

		var	validation: validationResult = this.isValid()
		if (!validation.result)
			throw new ValidationError(validation.error);
	}

	isValid(): validationResult {
		let	nameResult: validationResult | undefined;
		if (typeof this.username === "string") {
			nameResult = isValidName(this.username);
		}

		let	emailResult: validationResult | undefined;
		if (typeof this.email === "string") {
			emailResult = isValidEmail(this.email);
		}
		
		let	errors: string | undefined = [
			nameResult ? nameResult.error : "",
			emailResult ? emailResult.error : ""
		]
			.filter(error => error && error.length > 0)
			.join("; ");

		return { result: errors.length === 0, error: errors } // maybe change to send error by error
	}


	// GETTERS
	getId(): number {
		return this.id;
	}

	getUsername(): string | undefined {
		return this.username;
	}
	
	getEmail(): string | undefined {
		return this.email;
	}

	getAvatar(): string | undefined {
		return this.avatar;
	}

	getIs2faEnable(): boolean | undefined {
		return this.is2faEnable;
	}
}
