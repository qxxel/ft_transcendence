/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:44:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/12 21:37:37 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE TO DEFINE ALL THROW ERRORS FOR JWT SERVICE


/* ====================== CLASS ====================== */

export class	RequestEmptyError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RequestEmptyError";
	}
}

export class	UnauthorizedTokenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnauthorizedTokenError";
	}
}

export class	MissingTokenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingTokenError";
	}
}

export class	MissingIdError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingIdError";
	}
}
