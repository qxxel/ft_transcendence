/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameState.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 23:58:03 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 13:19:07 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE INTERFACE THAT CONTAIN THE PONG GAME (SAME AS THE FRONTEND)


/* ====================== GAME INTERFACES ====================== */

export interface	Ball {
	x: number;
	y: number;
	radius: number;
	dx: number;
	dy: number;
	speed: number;
	lastHitter: number;
}

export interface	Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	hits: number;
}

export interface	Collectible {
	id: number;
	x: number;
	y: number;
	radius: number;
	dy: number;
	active: boolean;
	type: string;
}

export interface	GameState {
	width: number;
	height: number;
	ball: Ball;
	paddle1: Paddle;
	paddle2: Paddle;
	collectibles: Collectible[];
	score1: number;
	score2: number;
	status: "playing" | "paused" | "finished";
}


/* ====================== OPTIONS INTERFACES ====================== */

export interface	PowerUps {
	star1: boolean;
	star2: boolean;
	star3: boolean;
}

export interface	GameOptions {
	width: number;
	height: number;
	isTournament: boolean;
	mode: 'ai' | 'pvp';
	p1name: string;
	p2name: string;
	difficulty: "easy" | "medium" | "hard" | "boris";
	winningScore: number;
	powerUpFreq: number;
	activePowerUps: PowerUps;
}


/* ====================== RESUME INTERFACES ====================== */

export interface	GameResume {
	winner: number;
	player1Hits: number;
	player2Hits: number;
	score1: number;
	score2: number;
	duration: number;
	longestRally: number;
}
