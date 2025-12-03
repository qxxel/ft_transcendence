/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentObjects.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/02 10:54:09 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 11:53:47 by agerbaud         ###   ########.fr       */
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
