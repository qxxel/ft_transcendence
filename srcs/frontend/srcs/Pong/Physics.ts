/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Physics.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:05:33 by kiparis           #+#    #+#             */
/*   Updated: 2025/11/27 15:02:38 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLES COLLISION DETECTION AND MOVEMENT CALCULATIONS

/* ====================== IMPORTS ====================== */

import type { Ball, Paddle, Collectible } from "./Pong.js";

/* ====================== CLASS ====================== */

export class PongPhysics {
    private width: number;
    private height: number;
    private readonly maxBallSpeed = 12;
    private readonly ballSpeedIncrease = 0.5;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public update(ball: Ball, p1: Paddle, p2: Paddle): number {
        const prevBallX = ball.x - ball.dx;
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y + ball.radius > this.height) {
            ball.y = this.height - ball.radius;
            ball.dy *= -1;
        } 
        else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.dy *= -1;
        }

        if (ball.dx < 0 && 
            ball.x - ball.radius <= p1.x + p1.width && 
            prevBallX - ball.radius >= p1.x + p1.width && 
            ball.y + ball.radius > p1.y &&
            ball.y - ball.radius < p1.y + p1.height) {
            
            ball.x = p1.x + p1.width + ball.radius; 
            
            this.calculateDeflection(p1, ball, 1);
            this.increaseBallSpeed(ball);
        }

        if (ball.dx > 0 && 
            ball.x + ball.radius >= p2.x && 
            prevBallX + ball.radius <= p2.x && 
            ball.y + ball.radius > p2.y &&
            ball.y - ball.radius < p2.y + p2.height) {
            
            ball.x = p2.x - ball.radius; 
            
            this.calculateDeflection(p2, ball, 2);
            this.increaseBallSpeed(ball);
        }

        if (ball.x + ball.radius < 0) return 2;
        if (ball.x - ball.radius > this.width) return 1;
        
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

    private increaseBallSpeed(ball: Ball) {
        if (ball.speed >= this.maxBallSpeed) return;
        const newSpeed = Math.min(ball.speed + this.ballSpeedIncrease, this.maxBallSpeed);
        const magnitude = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
        if (magnitude > 0) {
            ball.dx = (ball.dx / magnitude) * newSpeed;
            ball.dy = (ball.dy / magnitude) * newSpeed;
            ball.speed = newSpeed;
        }
    }
    
    public movePaddle(paddle: Paddle, up: boolean, down: boolean) {
        if (up && paddle.y > 0) {
            paddle.y -= paddle.speed;
        }
        if (down && paddle.y < this.height - paddle.height) {
            paddle.y += paddle.speed;
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
            // Formula: sqrt((x2-x1)^2 + (y2-y1)^2)
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