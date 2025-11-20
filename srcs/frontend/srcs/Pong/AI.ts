/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AI.ts                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:04:46 by kiparis           #+#    #+#             */
/*   Updated: 2025/11/20 23:26:41 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// MANAGES THE AI LOGIC AND PREDICTIONS

/* ====================== INTERFACES ====================== */

interface AIState {
    ball: { x: number, y: number, dx: number, dy: number, radius: number };
    paddle: { x: number, y: number, height: number };
    opponentPaddle: { y: number };
    canvasHeight: number;
}

/* ====================== CLASS ====================== */

export class AIController {
    private lastDecisionTime: number = 0;
    private targetY: number = 0;

    constructor() {}

    public update(state: AIState): { up: boolean, down: boolean } {
        const now = Date.now();
        const keys = { up: false, down: false };

        if (now - this.lastDecisionTime > 1000) {
            this.lastDecisionTime = now;

            if (state.ball.dx > 0) {
                let predictedY = this.predictBallLandingY(state);
                predictedY = this.adjustShootDirection(predictedY, state);
                
                predictedY = Math.max(state.ball.radius, Math.min(predictedY, state.canvasHeight - state.ball.radius));
                
                this.targetY = predictedY;
            } else {
                this.targetY = state.canvasHeight / 2;
            }
        }

        const paddleCenter = state.paddle.y + state.paddle.height / 2;
        const deadZone = 10;

        if (paddleCenter < this.targetY - deadZone) {
            keys.down = true;
        } else if (paddleCenter > this.targetY + deadZone) {
            keys.up = true;
        }

        return keys;
    }

    private predictBallLandingY(state: AIState): number {
        const targetX = state.paddle.x - state.ball.radius;
        const timeToImpact = (targetX - state.ball.x) / state.ball.dx;
        let predictedY = state.ball.y + (state.ball.dy * timeToImpact);

        const topWall = state.ball.radius;
        const bottomWall = state.canvasHeight - state.ball.radius;

        while (predictedY < topWall || predictedY > bottomWall) {
            if (predictedY < topWall) {
                predictedY = topWall + (topWall - predictedY);
            } else if (predictedY > bottomWall) {
                predictedY = bottomWall - (predictedY - bottomWall);
            }
        }
        return predictedY;
    }

    private adjustShootDirection(predictedY: number, state: AIState): number {
        let newY = predictedY;
        if (state.opponentPaddle.y < state.paddle.y) {
            newY -= (state.paddle.height / 3);
        } else if (state.opponentPaddle.y > state.paddle.y) {
            newY += (state.paddle.height / 3);
        }
        return newY;
    }
}