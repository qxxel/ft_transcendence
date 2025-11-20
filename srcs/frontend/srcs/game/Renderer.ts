/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Renderer.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:06:22 by kiparis           #+#    #+#             */
/*   Updated: 2025/11/20 23:07:08 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { Ball, Paddle } from "./game.js";

export class PongRenderer {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    public draw(p1: Paddle, p2: Paddle, ball: Ball) {
        // Background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Paddles
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
        this.ctx.fillRect(p2.x, p2.y, p2.width, p2.height);

        //Ball
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Line
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
    }

    public drawPaused() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '50px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
    }

    public drawGameOver(winnerName: string, isTournament: boolean) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '50px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 60);
        this.ctx.font = '30px monospace';
        this.ctx.fillText(`${winnerName} Wins!`, this.width / 2, this.height / 2 - 10);
        
        this.ctx.font = '20px monospace';
        const message = isTournament ? "Press 'Space' to Continue" : "Press 'Space' to Restart";
        this.ctx.fillText(message, this.width / 2, this.height / 2 + 40);
    }
}