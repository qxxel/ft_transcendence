/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongAi.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 23:59:46 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 06:10:43 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT CONTAINS THE CLASS OF THE AI OPPONENT IN PONG GAME


/* ====================== IMPORT ====================== */

import type { PongState }	from "./pongState.js"


/* ====================== CLASS ====================== */

export class AIController {
	private lastDecisionTime: number = 0;
	private targetY: number = 0;
	private difficulty: 'easy' | 'medium' | 'hard' | 'boris';

	constructor(difficulty: 'easy' | 'medium' | 'hard' | 'boris') {
		this.difficulty = difficulty;
	}

	public update(state: PongState): { up: boolean, down: boolean } {
		const	now = Date.now();
		const	keys = { up: false, down: false };

		
		if (now - this.lastDecisionTime > 1000 || this.difficulty == 'boris') {
			this.lastDecisionTime = now;
			if (state.ball.dx > 0) {
				let	predictedY = this.predictBallLandingY(state);
				if (this.difficulty == 'hard' || this.difficulty == 'boris'){
					this.targetY = this.calculateOptimalPaddlePosition(predictedY, state);
				}
				else {
					const	errorMargin = (this.difficulty === 'easy') ? state.paddle2.height / 10 : state.paddle2.height / 2;
					const	randomOffset = (Math.random() * errorMargin * 2) - errorMargin;
					this.targetY = predictedY + randomOffset;
				}
				this.targetY = Math.max(state.paddle2.height / 2, Math.min(this.targetY, state.height - state.paddle2.height / 2));
				
			} else {
				if (this.difficulty != 'easy'){
					this.targetY = state.height / 2;
				}
			}
		}
		const	paddleCenter = state.paddle2.y + state.paddle2.height / 2;
		const	deadZone = 10;

		if (paddleCenter < this.targetY - deadZone) {
			keys.down = true;
		} else if (paddleCenter > this.targetY + deadZone) {
			keys.up = true;
		}
		return keys;
	}

	private predictBallLandingY(state: PongState): number {
		const	targetX = state.paddle2.x - state.ball.radius;
		const	timeToImpact = (targetX - state.ball.x) / state.ball.dx;
		let	predictedY = state.ball.y + (state.ball.dy * timeToImpact);

		const	topWall = state.ball.radius;
		const	bottomWall = state.height - state.ball.radius;

		while (predictedY < topWall || predictedY > bottomWall) {
			if (predictedY < topWall) {
				predictedY = topWall + (topWall - predictedY);
			} else if (predictedY > bottomWall) {
				predictedY = bottomWall - (predictedY - bottomWall);
			}
		}
		return predictedY;
	}

	private offensiveBounce(predictedY: number, state: PongState): number {

		const	opponentCenterY = state.paddle1.y + (state.paddle1.height / 2);
		let	targetY = 0;

		if (opponentCenterY < state.height / 2) {
			targetY = state.height;
		} else {
			targetY = 0;
		}

		const	distanceX = state.paddle2.x; 
		const	distanceY = targetY - predictedY;

		// tan(angle) = opposite / adjacent
		let	requiredAngle = Math.atan(distanceY / distanceX);
		const	maxAngle = Math.PI / 3;
		if (requiredAngle > maxAngle) requiredAngle = maxAngle;
		if (requiredAngle < -maxAngle) requiredAngle = -maxAngle;

		// bounceAngle = normalizedIntersectY * maxAngle ==> normalizedIntersectY = requiredAngle / maxAngle
		const	normalizedIntersectY = requiredAngle / maxAngle;
		const	offset = normalizedIntersectY * (state.paddle2.height / 2);
		return predictedY - offset;
	}

	private hardBounce(predictedY: number, state: PongState): number{
		const	opponentCenterY = state.paddle1.y + (state.paddle1.height / 2);
		const	center = state.height / 2;

		const	aimForBottom = opponentCenterY < center;
		const	maxOffset = (state.paddle2.height / 2) * 0.8;

		if (aimForBottom) {
			return predictedY - maxOffset;
		} else {
			return predictedY + maxOffset;
		}
	}

	private calculateOptimalPaddlePosition(predictedY: number, state: PongState): number {
		if (Math.random() > 0.5){
			return this.hardBounce(predictedY, state);
		}
		else {
			return this.offensiveBounce(predictedY, state);
		}
	}
}
