/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_tank.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:32:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:33:43 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { Actor }	from "./class_actor.js"
import { Tank }		from "./class_tank.js"
import { Ball }		from "./class_ball.js"
import { GSTATE }	from "./global.js"
import { Rect2D }	from "./class_rect.js"

import type { Color, Keys }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Collectible extends Actor {

	rect: Rect2D;

	constructor(
		x:number,
		y:number,
		public	w:number,
		public	h:number,
		public	type:string,
		public	color:Color) {
		super(x,y)
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		console.log("C Ball at x:", x, "y:", y);
	}

	update(input: string[]): void {
		if (this.collide(this.rect))
			GSTATE.REDRAW = true;
	}

	draw(ctx: CanvasRenderingContext2D): void {
			// this.rect.draw(ctx, {r:0,g:0,b:255});
			ctx.beginPath();
			ctx.fillStyle = `#${((this.color.r << 16) | (this.color.g << 8) | this.color.b).toString(16).padStart(6,'0')}`; // HUH
			ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
			ctx.fill();
	}


	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
				console.log("COLIDE");

			if (a == this || a instanceof Ball) continue;
			if (a.getRect().collide(rect1))
			{
				if (a instanceof Tank) {
					this.collected(a);
					this.destroy();
				}
				return true;
			}
		}
		return false;
	}

	collected(a: Tank) {
		if (this.type == 'SPEED')
			a.speed = 15;
	}

	getRect(): Rect2D { return this.rect; };

	getBounce(other: Rect2D): "horizontal" | "vertical" {
		const dx = (this.x + this.w / 2) - (other.x + other.w / 2);
		const dy = (this.y + this.h / 2) - (other.y + other.h / 2);

		const overlapX = (this.w / 2 + other.w / 2) - Math.abs(dx);
		const overlapY = (this.h / 2 + other.h / 2) - Math.abs(dy);


		// console.log(dx, dy, overlapX, overlapY);
		return overlapX < overlapY ? "horizontal" : "vertical";
	}
}