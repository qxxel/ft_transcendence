/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 18:47:53 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/12 03:32:01 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE TO DEFINE ALL THROW ERRORS FOR TWOFA SERVICE


/* ====================== CLASSES ====================== */

export class	RequestEmptyError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RequestEmptyError";
	}
}

export class	BadCodeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BadCodeError";
	}
}