/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userUpdateDto.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:13:44 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:30:43 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR UPDATES ON USERS


/* ====================== IMPORTS ====================== */

// import { isValidName, isValidEmail } from '../utils/validation.js'
// import type { validationResult } from '../utils/validation.js';


/* ====================== CLASS ====================== */

// export class	userUpdateDto {
// 	private	username?: string;
// 	private	email?: string;

// 	constructor(row: any) {
// 		this.username = row.username;
// 		this.email = row.email;

// 		var	validation = this.isValid()
// 		if (!validation.result)
// 			throw new Error(validation.error);
// 	}

// 	isValid(): validationResult {
// 		if (this.username !== undefined)
// 			const	nameResult = isValidName(this.username);
// 		const	emailResult = isValidEmail(this.email);

// 		const	errors = [nameResult.error, emailResult.error]
// 			.filter(error => error && error.length > 0)
// 			.join(", ");

// 		const	result = !nameResult.result || !emailResult.result;

// 		return { result: result, error: errors } // change to send error by error
// 	}


// 	// GETTERS
// 	getName(): string {
// 		return this.username;
// 	}

// 	getEmail(): string {
// 		return this.email;
// 	}
// }
