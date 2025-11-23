/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:49:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 19:28:53 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE TO DEFINE ALL THROW ERRORS FOR USER SERVICE


/* ====================== CLASS ====================== */

export class	NotExistError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotExistError";
	}
}
