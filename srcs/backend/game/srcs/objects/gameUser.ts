/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameUser.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 16:09:57 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 16:12:29 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// OBJECT THAT CONTAINS GAME USER INTERFACE


/* ====================== INTERFACE ====================== */

export interface	GameUser {
	id: number;
	id_client: number;
	winner: number;
	p1: string;
	p1score: number;
	p2: string; 
	p2score: number;
	mode: string;
	powerup: number;
	start: number;
	duration: number;
}
