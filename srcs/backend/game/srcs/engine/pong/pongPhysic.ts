/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongPhysic.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 23:58:47 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 00:20:38 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE CLASS THAT CALCULATE PHYSIC IN PONG GAME


/* ====================== IMPORTS ====================== */

import type { Ball, Paddle, Collectible }	from "./gameState.js"


/* ====================== CLASS ====================== */

export class PongPhysics {
	private width: number;
	private height: number;
	private	rally: number = 0;
	private readonly maxBallSpeed = 12;
	private readonly ballSpeedIncrease = 0.5;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public update(ball: Ball, p1: Paddle, p2: Paddle): number {
		const prevBallY = ball.y - ball.dy;

		ball.x += ball.dx;
		ball.y += ball.dy;

		const minDx = 2.0;

		if (ball.y + ball.radius > this.height) {
			ball.y = this.height - ball.radius;
			ball.dy *= -1;
		} 
		else if (ball.y - ball.radius < 0) {
			ball.y = ball.radius;
			ball.dy *= -1;
		}

		if (ball.x - ball.radius < p1.x + p1.width &&
			ball.x + ball.radius > p1.x &&
			ball.y + ball.radius > p1.y &&
			ball.y - ball.radius < p1.y + p1.height) {
			
			if (prevBallY + ball.radius <= p1.y) {
				ball.y = p1.y - ball.radius - 1;
				ball.dy = -Math.abs(ball.dy);
			}
			else if (prevBallY - ball.radius >= p1.y + p1.height) {
				ball.y = p1.y + p1.height + ball.radius + 1;
				ball.dy = Math.abs(ball.dy);
			}
			else if (ball.dx < 0) {
				ball.x = p1.x + p1.width + ball.radius;
				this.rally++;
				this.calculateDeflection(p1, ball, 1);
				this.increaseBallSpeed(ball);
			}
		}

		if (ball.x + ball.radius > p2.x &&
			ball.x - ball.radius < p2.x + p2.width &&
			ball.y + ball.radius > p2.y &&
			ball.y - ball.radius < p2.y + p2.height) {
			
			if (prevBallY + ball.radius <= p2.y) {
				ball.y = p2.y - ball.radius - 1; 
				ball.dy = -Math.abs(ball.dy);
			}
			else if (prevBallY - ball.radius >= p2.y + p2.height) {
				ball.y = p2.y + p2.height + ball.radius + 1;
				ball.dy = Math.abs(ball.dy);
			}
			else if (ball.dx > 0) {
				ball.x = p2.x - ball.radius;
				this.rally++;
				this.calculateDeflection(p2, ball, 2);
				this.increaseBallSpeed(ball);
			}
		}

		if (Math.abs(ball.dx) < minDx) {
			if (ball.dx > 0) ball.dx = minDx;
			else ball.dx = -minDx;
		}
		if (ball.x + ball.radius < 0)
		{
			// SEND LONGEST RALLY
			this.rally = 0;
			return 2;
		}
		if (ball.x - ball.radius > this.width)
		{
			// SEND LONGEST RALLY
			this.rally = 0;
			return 1;
		}
		
		return 0;
	}

	private calculateDeflection(paddle: Paddle, ball: Ball, playerID: number) {
		const relativeIntersectY = (paddle.y + (paddle.height / 2)) - ball.y;
		const normalizedIntersectY = relativeIntersectY / (paddle.height / 2);
		const maxBounceAngle = Math.PI / 3;
		const bounceAngle = normalizedIntersectY * maxBounceAngle;
		const direction = (ball.x < this.width / 2) ? 1 : -1;
		ball.dx = direction * ball.speed * Math.cos(bounceAngle);
		ball.dy = -1 * ball.speed * Math.sin(bounceAngle);
		ball.lastHitter = playerID;
		paddle.hits++;
	}

	public increaseBallSpeed(ball: Ball, customMaxSpeed?: number) {
		const limit = customMaxSpeed ?? this.maxBallSpeed;
		if (ball.speed >= limit) return;
		const newSpeed = Math.min(ball.speed + this.ballSpeedIncrease, limit);
		const magnitude = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
		if (magnitude > 0) {
			ball.dx = (ball.dx / magnitude) * newSpeed;
			ball.dy = (ball.dy / magnitude) * newSpeed;
			ball.speed = newSpeed;
		}
	}

	public movePaddle(paddle: Paddle, ball: Ball, direction: "up" | "down" | "none") {
		if (direction === "none")
			return ;

		const isHorizontalOverlap = 
			ball.x + ball.radius > paddle.x && 
			ball.x - ball.radius < paddle.x + paddle.width;

		if (direction === "up") {
			const nextY = paddle.y - paddle.speed;
			if (isHorizontalOverlap && 
				paddle.y >= ball.y + ball.radius && 
				nextY < ball.y + ball.radius) {
				paddle.y = ball.y + ball.radius + 1; 
			} 
			else if (nextY > 0) {
				paddle.y = nextY;
			} else {
				paddle.y = 0;
			}
		}

		if (direction === "down") {
			const nextY = paddle.y + paddle.speed;
			if (isHorizontalOverlap && 
				paddle.y + paddle.height <= ball.y - ball.radius && 
				nextY + paddle.height > ball.y - ball.radius) {
				paddle.y = ball.y - ball.radius - paddle.height - 1;
			} 
			else if (nextY < this.height - paddle.height) {
				paddle.y = nextY;
			} else {
				paddle.y = this.height - paddle.height;
			}
		}
	}

	public updateCollectibles(collectibles: Collectible[]) {
		for (const c of collectibles) {
			c.y += c.dy;

			if (c.y - c.radius < 0 || c.y + c.radius > this.height) {
				
				if (c.y - c.radius < 0) c.y = c.radius;
				else c.y = this.height - c.radius;

				if (Math.random() < 0.3) {
					c.active = false;
				} else {
					c.dy *= -1;
				}
			}
		}
	}

	public checkCollectibleCollision(ball: Ball, collectibles: Collectible[]): number {
		for (const c of collectibles) {
			const dx = ball.x - c.x;
			const dy = ball.y - c.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < ball.radius + c.radius) {
				return c.id;
			}
		}
		return -1;
	}
}