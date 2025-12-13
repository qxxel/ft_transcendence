/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentObjects.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/02 10:54:09 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:42:02 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE OBJECTS THAT ARE USEFULL FOR TOURNAMENTS


/* ====================== INTERFACES ====================== */

export interface	Player {
	name: string;
}

export interface	Match {
	id: string;
	round: number;
	matchNum: number;
	player1: Player | null;
	player2: Player | null;
	winner: Player | null;
	nextMatchId: string | null;
}
