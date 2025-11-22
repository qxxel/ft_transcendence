/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AI.ts                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:04:46 by kiparis           #+#    #+#             */
/*   Updated: 2025/11/22 02:39:32 by kiparis          ###   ########.fr       */
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
    private difficulty: 'easy' | 'medium' | 'hard' | 'boris';

    constructor(difficulty: 'easy' | 'medium' | 'hard' | 'boris') {
        this.difficulty = difficulty;
    }

    public update(state: AIState): { up: boolean, down: boolean } {
        const now = Date.now();
        const keys = { up: false, down: false };

        
        if (now - this.lastDecisionTime > 1000 || this.difficulty == 'boris') {
            this.lastDecisionTime = now;
            if (state.ball.dx > 0) {
                let predictedY = this.predictBallLandingY(state);
                if (this.difficulty == 'hard' || this.difficulty == 'boris'){
                    this.targetY = this.calculateOptimalPaddlePosition(predictedY, state);
                }
                else {
                    const errorMargin = (this.difficulty === 'easy') ? 7 : 60;
                    const randomOffset = (Math.random() * errorMargin * 2) - errorMargin;
                    this.targetY = predictedY + randomOffset;
                }
                this.targetY = Math.max(state.paddle.height / 2, Math.min(this.targetY, state.canvasHeight - state.paddle.height / 2));
                
            } else {
                if (this.difficulty != 'easy'){
                    this.targetY = state.canvasHeight / 2;
                }
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

    private offensiveBounce(predictedY: number, state: AIState): number {

        const opponentCenterY = state.opponentPaddle.y + (state.paddle.height / 2);
        let targetY = 0;
        
        if (opponentCenterY < state.canvasHeight / 2) {
            targetY = state.canvasHeight;
        } else {
            targetY = 0;
        }

        const distanceX = state.paddle.x; 
        const distanceY = targetY - predictedY;

        // tan(angle) = opposite / adjacent
        let requiredAngle = Math.atan(distanceY / distanceX);
        const maxAngle = Math.PI / 3;
        if (requiredAngle > maxAngle) requiredAngle = maxAngle;
        if (requiredAngle < -maxAngle) requiredAngle = -maxAngle;

        // bounceAngle = normalizedIntersectY * maxAngle ==> normalizedIntersectY = requiredAngle / maxAngle
        const normalizedIntersectY = requiredAngle / maxAngle;
        const offset = normalizedIntersectY * (state.paddle.height / 2);
        return predictedY - offset;
    }

    private hardBounce(predictedY: number, state: AIState): number{
        const opponentCenterY = state.opponentPaddle.y + (state.paddle.height / 2);
        const center = state.canvasHeight / 2;

        const aimForBottom = opponentCenterY < center;
        const maxOffset = (state.paddle.height / 2) * 0.8;

        if (aimForBottom) {
            return predictedY - maxOffset;
        } else {
            return predictedY + maxOffset;
        }
    }

    private calculateOptimalPaddlePosition(predictedY: number, state: AIState): number {
        if (Math.random() > 0.5){
            return this.hardBounce(predictedY, state);
        }
        else {
            return this.offensiveBounce(predictedY, state);
        }
    }
}
