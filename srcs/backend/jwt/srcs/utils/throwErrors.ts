/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:44:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:07:10 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE TO DEFINE ALL THROW ERRORS FOR JWT SERVICE


/* ====================== class	====================== */

export class	MissingIdError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingIdError";
	}
}
