/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userDto.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 17:16:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:39:31 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// INTERFACE FOR THE STORAGE OF USER DATA


/* ====================== interface	====================== */

export interface	userDto {
	id?: number;
	username: string;
	email: string;
	password?: string;
	elo?: number;
	is2faEnable?: boolean;
}
