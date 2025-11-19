/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_rect.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 16:24:43 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:26:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ====================== CLASS ====================== */

export class	Rect2D {
	private	x: number;
	private	y: number;
	private	w: number;
	private	h: number;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		c: number,
	) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw(ctx : CanvasRenderingContext2D): void {
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	getX(): number		{ return this.x; }
	getY(): number		{ return this.y; }
	getWidth(): number	{ return this.w; }
	getHeight(): number	{ return this.h; }

	getCenter(): { x: number; y: number } {
		return {
			x: this.x + this.w / 2,
			y: this.y + this.h / 2
		};
	}

}
