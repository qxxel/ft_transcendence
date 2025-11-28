/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_ball.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:24:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:25:31 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { Actor }	from "./class_actor.js"
import { GSTATE }	from "./global.js"
import { Rect2D }	from "./class_rect.js"
import { Tank }		from "./class_tank.js"
import { Input }	from "./class_input.js"
import type { Color }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Ball extends Actor {

	rect: Rect2D;
	redraw: boolean = true;
	speed: number = 5;
	damage: number = 1;
	bounce_count: number = 5;
	SCOTCH_DIRECTION_IMPACT: string = "";

	constructor(
		x:number,
		y:number,
		public	w:number,
		public	h:number,
		public	dx:number,
		public	dy:number,
		public	color:Color,
		public	author?:Tank) {
		super(x,y)
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		console.log("C Ball at x:", x, "y:", y);
	}

	update(input: Input): void {
		this.move();
		GSTATE.REDRAW = true;
	}

	draw(ctx: CanvasRenderingContext2D): void {
			// this.rect.draw(ctx, {r:0,g:0,b:255});
			ctx.beginPath();
			ctx.fillStyle = `#${((this.color.r << 16) | (this.color.g << 8) | this.color.b).toString(16).padStart(6,'0')}`; // HUH
			ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
			ctx.fill();
	 }

	// move(dx:number,dy:number) {
	//   if (this.collide(new Rect2D(this.x + dx, this.y + dy, this.w, this.h)))
	//       return;
	//   this.x += dx;
	//   this.y += dy;
	//   this.rect.x += dx;
	//   this.rect.y += dy;
	// }

	move(): void {
	const future: Rect2D = new Rect2D(this.x + this.dx, this.y + this.dy, this.w, this.h);

	if (this.collide(future)) {
		// console.log(this.SCOTCH_DIRECTION_IMPACT);
		if      (this.SCOTCH_DIRECTION_IMPACT == "vertical") this.dy = -this.dy;
		else if (this.SCOTCH_DIRECTION_IMPACT == "horizontal") this.dx = -this.dx;

		// const reboundFuture = new Rect2D(this.x + this.dx, this.y + this.dy, this.w, this.h);

		// if (!this.collide(reboundFuture)) {
			// this.x += this.dx;
			// this.y += this.dy;
			// this.rect.x += this.dx;
			// this.rect.y += this.dy;
		// }
		// return;
	}

		this.x += this.dx;
		this.y += this.dy;
		this.rect.x += this.dx;
		this.rect.y += this.dy;
	}

	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
			if (a == this || a == this.author) continue;
			if (a.getRect().collide(rect1))
			{
				if (a instanceof Tank) {
					a.addHealth(-this.damage);
					this.destroy();
				}
				this.bounce_count--;
				if (this.bounce_count <= 0)
					this.destroy();
				this.SCOTCH_DIRECTION_IMPACT = this.getBounce(a.getRect());
				return true;
			}
		}
		return false;
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