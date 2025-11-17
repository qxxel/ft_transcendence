/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userDto.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 17:16:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 17:21:03 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// INTERFACE FOR THE STORAGE OF USER DATA


/* ====================== INTERFACE ====================== */

export interface userDto {
	id?: number;
	username: string;
	email: string;
	password: string;
	elo?: number;
}
