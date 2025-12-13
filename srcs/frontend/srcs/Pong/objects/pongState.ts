/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongState.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/01 19:53:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:41:58 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE OBJECTS THAT CONTAINS GAME STATE


/* ====================== INTERFACES ====================== */

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

export interface	PongState {
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
