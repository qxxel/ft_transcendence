/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:47:53 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/12 22:57:21 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE TO DEFINE ALL THROW ERRORS FOR AUTH SERVICE


/* ====================== CLASSES ====================== */

export class	RequestEmptyError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RequestEmptyError";
	}
}

export class	AlreadyConnectedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AlreadyConnectedError";
	}
}

export class	WrongCredentialsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "WrongCredentialsError";
	}
}

export class	InvalidSyntaxError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidSyntaxError";
	}
}

export class	MissingIdError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingIdError";
	}
}