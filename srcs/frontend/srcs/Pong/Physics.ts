/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Physics.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:05:33 by kiparis           #+#    #+#             */
/*   Updated: 2025/11/20 23:12:14 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { Ball, Paddle } from "./Pong.js";

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

        if (ball.y + ball.radius > this.height || ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }

        if (ball.dx < 0 && ball.x - ball.radius <= p1.x + p1.width && prevBallX - ball.radius >= p1.x + p1.width && ball.y > p1.y && ball.y < p1.y + p1.height) {
            this.calculateDeflection(p1, ball);
            this.increaseBallSpeed(ball);
        }

        if (ball.dx > 0 && ball.x + ball.radius >= p2.x && prevBallX + ball.radius <= p2.x && ball.y > p2.y && ball.y < p2.y + p2.height) {
            this.calculateDeflection(p2, ball);
            this.increaseBallSpeed(ball);
        }

        if (ball.x + ball.radius < 0) return 2;
        if (ball.x - ball.radius > this.width) return 1;
        
        return 0;
    }

    private calculateDeflection(paddle: Paddle, ball: Ball) {
        const relativeIntersectY = (paddle.y + (paddle.height / 2)) - ball.y;
        const normalizedIntersectY = relativeIntersectY / (paddle.height / 2);
        const maxBounceAngle = Math.PI / 3;
        const bounceAngle = normalizedIntersectY * maxBounceAngle;
        const direction = (ball.x < this.width / 2) ? 1 : -1;
        ball.dx = direction * ball.speed * Math.cos(bounceAngle);
        ball.dy = -1 * ball.speed * Math.sin(bounceAngle);
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
}