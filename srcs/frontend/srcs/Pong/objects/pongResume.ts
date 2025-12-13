/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongResume.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/01 21:10:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:41:54 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE OBJECTS THAT CONTAINS THE RESUME OF THE GAME


/* ====================== INTERFACES ====================== */

export interface	PongResume {
	winner: number;
	player1Hits: number;
	player2Hits: number;
	score1: number;
	score2: number;
	duration: number;
	longestRally: number;
}
