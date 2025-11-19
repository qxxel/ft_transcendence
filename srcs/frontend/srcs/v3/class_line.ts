/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_line.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:28:44 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:29:41 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORT ============================= */

import type { Color }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Line2D {

	h: number;

	constructor(
		public	x1: number,
		public	y1: number,
		public	x2: number,
		public	y2: number,
		public	w: number,
		public	angle: number,
	) {
		this.h = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}


	draw(ctx : CanvasRenderingContext2D, color: Color): void {
		ctx.strokeStyle = '#e100ffaa';
		ctx.lineWidth = this.w; //ctx.lineWidth = stickWidth;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}

	collide(): boolean {
		return false;
	}

	getEnd(): { x: number; y: number } {
		return { x: this.x2, y: this.y2 };
	}

	move(dx: number, dy: number): boolean {
		this.x1 += dx;
		this.y1 += dy;
		this.x2 += dx;
		this.y2 += dy;
		return false;
	}

	slope(angle: number): void {
		this.angle += angle;
		this.x2 = this.x1 + Math.cos(this.angle) * this.h;
		this.y2 = this.y1 + Math.sin(this.angle) * this.h;
	
	}

	getX(): number { return this.x2; }
	getY(): number { return this.y2; }
	getW(): number { return this.w; }
	getH(): number { return this.h; }
	getA(): number { return this.angle; }

}