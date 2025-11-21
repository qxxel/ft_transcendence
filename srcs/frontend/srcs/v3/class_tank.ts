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
import { Ball }		from "./class_ball.js"
import { Cannon }	from "./class_cannon.js"
import { GSTATE }	from "./global.js"
import { Hud }		from "./class_hud.js"
import { Rect2D }	from "./class_rect.js"

import type { Color, Keys }	from "./interface.js"
import { Collectible } from "./class_collectible.js"


/* ============================= CLASS ============================= */

export class	Tank extends Actor {

	rect: Rect2D;
	cannon: Cannon;
	speed: number = 0.75;
	rot_speed: number = 0.05;
	health: number = 5;
	fire_rate: number = 2000; // ms
	fire_last: number = 0;
	fire_speed: number = 3;
	hud: Hud;
	constructor(
		x:number,
		y:number,
		public	w:number,
		public	h:number,
		public	color:Color,
		public	fire_color:Color,
		public	keys:Keys) {
		super(x,y)
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		this.cannon = new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),3,0,fire_color);
		this.hud = new Hud(this.x,this.y,this.x + this.w, this.y,fire_color);
		console.log("C Tank at x:", x, "y:", y);
	}

	update(input: string[]): void {
		this.listen(input);
		if (Date.now() - this.fire_last < this.fire_rate)
			GSTATE.REDRAW = true;
		
	}

	draw(ctx: CanvasRenderingContext2D): void {
			this.rect.draw(ctx, this.color)
			this.cannon.draw(ctx);

			if (!this.canFire()) {
				const elapsed = Date.now() - this.fire_last;
				const progress = Math.min(elapsed / this.fire_rate, 1);
				const start = -Math.PI / 2;
				const end = start + progress * Math.PI * 2;
				this.hud.wheel_draw(ctx,start,end);
		}
	}

	listen(input: string[]): void {
		for (let inp of input) {
			// console.log("INPUT =", inp);
			if (inp == this.keys.up)        { this.move(0,-this.speed); GSTATE.REDRAW = true; }
			if (inp == this.keys.down)      { this.move(0,+this.speed); GSTATE.REDRAW = true; }
			if (inp == this.keys.left)      { this.move(-this.speed,0); GSTATE.REDRAW = true; }
			if (inp == this.keys.right)     { this.move(+this.speed,0); GSTATE.REDRAW = true; }
			if (inp == this.keys.rot_left)  { this.cannon.slope(-this.rot_speed); GSTATE.REDRAW = true; }
			if (inp == this.keys.rot_right) { this.cannon.slope(+this.rot_speed); GSTATE.REDRAW = true; }
			if (inp == this.keys.fire) this.fire();
		}
	}

	move(dx:number,dy:number): void {
		if (this.collide(new Rect2D(this.x + dx, this.y + dy, this.w, this.h)))
				return;
		this.x += dx;
		this.y += dy;
		this.rect.x += dx;
		this.rect.y += dy;
		this.cannon.move(dx,dy);
		this.hud.move(dx,dy);
	}

	fire(): void {

		if (!this.canFire()) return;
		
		const now = Date.now(); // performance.now();

		const spawnRect = new Rect2D(this.cannon.getEnd().x - 10/2 ,this.cannon.getEnd().y - 10/2 ,10,10);

		for (let a of GSTATE.ACTORS) {
			if (a == this)
				continue;
			if (a.getRect().collide(spawnRect))
				return;
		}

		this.fire_last = now;

		GSTATE.ACTORS.push(
				new Ball(this.cannon.getEnd().x - 10/2 ,this.cannon.getEnd().y - 10/2 ,10,10, Math.cos(this.cannon.geometry.angle) * 3, Math.sin(this.cannon.geometry.angle) * 3,
					this.fire_color, this));

	 }

	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
			if (a == this || a instanceof Ball || a instanceof Collectible) continue;
			if (a.getRect().collide(rect1))
			{
				return true;
			}
		}
		return false;
	}

	getRect(): Rect2D { return this.rect; };

	addHealth(amount:number): void { // TODO parceque la c'est un peu hardcode quoi
		this.health += amount;
		this.color.r += 50;
		this.color.g -= 50;
		console.log("health():",this.health);
		if (this.health == 0) {
			GSTATE.TANKS -= 1;
			this.destroy();
		}
	}

	canFire(): boolean {
			return Date.now() - this.fire_last > this.fire_rate;
	}
}