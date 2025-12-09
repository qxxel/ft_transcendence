/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   interface.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:36:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:36:39 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= INTERFACES ============================= */

export interface	Color { // will be a class	for the futur because we maybe want change color logic later on.
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
