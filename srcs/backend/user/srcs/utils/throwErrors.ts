/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:49:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 13:03:37 by agerbaud         ###   ########.fr       */
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

export class	NoRequestPendingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NoRequestPendingError";
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
