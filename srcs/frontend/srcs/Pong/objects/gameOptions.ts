/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameOptions.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/01 19:49:30 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 13:17:43 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL OBJECTS THAT CONTAINS GAME OPTIONS


/* ====================== INTERFACES ====================== */

export interface	PowerUps {
	star1: boolean;
	star2: boolean;
	star3: boolean;
}

export interface	GameOptions {
	width: number;
	height: number;
	isTournament: boolean;
	p1name: string;
	p2name: string | undefined;
	mode: 'ai' | 'pvp';
	difficulty: "easy" | "medium" | "hard" | "boris";
	winningScore: number;
	powerUpFreq: number;
	activePowerUps: PowerUps;
}
