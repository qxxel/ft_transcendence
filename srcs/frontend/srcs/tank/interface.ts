/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   interface.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:36:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 19:12:34 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT DEFINES SHARED INTERFACES FOR COLORS AND INPUT KEY MAPPINGS


/* ============================= INTERFACES ============================= */

export interface	Color {
	r:number;
	g:number;
	b:number;
};

export interface	Keys {
	up: string,
	down: string,
	left: string,
	right: string,
	rot_left: string,
	rot_right: string,
	fire: string
	ability: string
};
