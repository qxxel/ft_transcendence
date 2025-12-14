/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   renderer.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:06:22 by kiparis           #+#    #+#             */
/*   Updated: 2025/12/14 03:36:19 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLES DRAWING TO THE CANVAS

/* ====================== IMPORTS ====================== */

import type { Ball, Paddle, Collectible } from "./objects/pongState.js";


/* ====================== CLASS ====================== */

export class PongRenderer {
	private ctx: CanvasRenderingContext2D;
	private width: number;
	private height: number;

	constructor(canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d')!;
		this.width = canvas.width;
		this.height = canvas.height;
	}

	public draw(p1: Paddle, p2: Paddle, ball: Ball, collectibles: Collectible[]) {
		this.ctx.fillStyle = '#000';
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.ctx.setLineDash([]);

		this.ctx.fillStyle = '#fff';
		this.ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
		this.ctx.fillRect(p2.x, p2.y, p2.width, p2.height);

		for (const	c of collectibles) {
			switch (c.type) {
				case 'IncreaseBallSize':
					this.ctx.fillStyle = '#FFFF00';
					this.ctx.strokeStyle = '#0000FF';
					break;
				case 'DecreaseBallSize':
					this.ctx.fillStyle = '#FFFF00';
					this.ctx.strokeStyle = '#FF0000';
					break;
				case 'IncreasePaddleSize':
					this.ctx.fillStyle = '#00FFFF';
					this.ctx.strokeStyle = '#0000FF';
					break;
				case 'DecreasePaddleSize':
					this.ctx.fillStyle = '#00FFFF';
					this.ctx.strokeStyle = '#FF0000';
					break;
				case 'ChangeBallDirection':
					this.ctx.fillStyle = '#FF00FF';
					this.ctx.strokeStyle = '#FFFF00';
					break;
				case 'IncreaseGameSpeed':
					this.ctx.fillStyle = '#888888';
					this.ctx.strokeStyle = '#FFFF00';
					break;
			}
			this.ctx.lineWidth = 4;

			this.ctx.beginPath();
			this.ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
			this.ctx.fill();
			this.ctx.stroke();
		}

		this.ctx.fillStyle = '#fff';
		this.ctx.beginPath();
		this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		this.ctx.fill();

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
		this.ctx.font = '15px monospace';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('Press \'Esc\' to resume', this.width / 2, this.height / 1.85);
	}

	public drawGameOver(winnerName: string, isTournament: boolean) {
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
		this.ctx.fillRect(0, 0, this.width, this.height);
	}
}