/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_ball.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 16:25:43 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:26:25 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ====================== UTILS CONST ====================== */

const	ballRadius: number = 7;
const	ballSpeed: number = 2;


/* ====================== CLASS ====================== */

export class	Ball {
	private	x: number;
	private	y: number;
	private	radius: number;
	private	speed: number;
	private	dx: number;
	private	dy: number;

	constructor(
		x: number,
		y: number,
		dx: number,
		dy: number,
	) {
		this.x = x;
		this.y = y;
		this.radius = ballRadius;
		this.speed = ballSpeed;
		this.dx = dx * ballSpeed;
		this.dy = dy * ballSpeed;
	}

	update(canvas: HTMLCanvasElement): boolean {
		const	prevBallX: number = this.x - this.dx;
		this.x += this.dx;
		this.y += this.dy;

		if (this.y + this.radius > canvas!.height || this.y - this.radius < 0) {
			this.dy *= -1;
		}

		if (this.x + this.radius < 0) {
			return true;
		} else if (this.x - this.radius > canvas!.width) {
			return true;
		}
		return false;
	}

	draw(ctx : CanvasRenderingContext2D): void {
		ctx.fillStyle = '#dc2626';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}
}
