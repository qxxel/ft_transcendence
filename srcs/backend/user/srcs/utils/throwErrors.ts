/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:49:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/29 11:44:25 by mreynaud         ###   ########.fr       */
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

export class	AlreadyRelatedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AlreadyRelatedError";
	}
}

export class	AlreadyAcceptedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AlreadyAcceptedError";
	}
}

export class	NoRelationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NoRelationError";
	}
}

export class	BlockedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BlockedError";
	}
}

export class	SelfFriendRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SelfFriendRequestError";
	}
}

export class	MissingHeaderError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingHeaderError";
	}
}
