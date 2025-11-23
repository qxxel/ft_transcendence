/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:49:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 14:39:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE TO DEFINE ALL THROW ERRORS FOR USER SERVICE


/* ====================== CLASSES ====================== */

export class	IsTakenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "IsTakenError";
	}
}

export class	ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export class	NotExistError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotExistError";
	}
}

export class	GameNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GameNotFoundError";
	}
}
