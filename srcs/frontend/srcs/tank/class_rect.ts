/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_rect.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:30:41 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:32:28 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS THAT DEFINES A 2D RECTANGLE WITH COLLISION AND DRAWING UTILITIES


/* ============================= IMPORT ============================= */

import type { Color }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Rect2D {

	constructor(
		public	x: number,
		public	y: number,
		public	w: number,
		public	h: number,
	) {}



	getCenter(): { x: number; y: number } {
		return {
			x: this.x + this.w / 2,
			y: this.y + this.h / 2
		};
	}

	draw(ctx : CanvasRenderingContext2D, color: Color): void {
		ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	collide(other: Rect2D): boolean {
		if (other instanceof Rect2D) {
			return this.x < other.x + other.w &&
						 this.x + this.w > other.x &&
						 this.y < other.y + other.h &&
						 this.y + this.h > other.y;
		}
		return false;
	}

	move(dx: number, dy: number): boolean {
		this.x += dx;
		this.y += dy;
		return false;
	}

	getX(): number { return this.x; }
	getY(): number { return this.y; }
	getW(): number { return this.w; }
	getH(): number { return this.h; }
	getA(): number { return 0; }
}