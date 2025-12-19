/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   throwErrors.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:49:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:50:00 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE TO DEFINE ALL THROW ERRORS FOR NOTIF SERVICE


/* ====================== CLASS ====================== */

export class	MissingHeaderError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MissingHeaderError";
	}
}
