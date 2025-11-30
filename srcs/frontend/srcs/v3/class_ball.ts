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
	direction_impact: string = "";

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

	move(): void {
	const future: Rect2D = new Rect2D(this.x + this.dx, this.y + this.dy, this.w, this.h);

	if (this.collide(future)) {
		if      (this.direction_impact == "vertical") this.dy = -this.dy;
		else if (this.direction_impact == "horizontal") this.dx = -this.dx;
	}
		this.x += this.dx;
		this.y += this.dy;
		this.rect.x += this.dx;
		this.rect.y += this.dy;
	}

	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
			if (a == this || a == this.author || a instanceof Collectible) continue;
			if (a.getRect().collide(rect1))
			{
				if (a instanceof Tank) {
					a.addHealth(-this.damage);
					this.destroy();
					return true;
				}
				if (this.author!.id == 0)
					GSTATE.STATS1.bounce += 1;
				else
					GSTATE.STATS2.bounce += 1;

				this.bounce_count--;
				if (this.bounce_count <= 0)
					this.destroy();
				this.direction_impact = this.getBounce(a.getRect());
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
		return overlapX < overlapY ? "horizontal" : "vertical";
	}
}

export class	Collectible extends Ball {

	rect: Rect2D;

	constructor(
		x:number,
		y:number,
		w:number,
		h:number,
		public type:string) {

		super(x,y,w,h,0,0, {r:50,g:170,b:40}); //{r:50,g:170,b:40}

		switch (this.type) {
        	case 'heal':
        		this.color = {r:50,g:170,b:40};    
				break;
			case 'speed':
        		this.color = {r:0,g:100,b:150};    
        	    break;
    	}
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
	}

	getRect(): Rect2D { return this.rect; };

	effect(a: Tank) {

		const b = new Actor(0,0);
    switch (this.type) {
        case 'heal':
			a.addHealth(+1);
            break;
		case 'speed':
			a.speed = Math.min(a.speed+1, 10);
            break;
    	}
	}
	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
			if (a == this || a instanceof Collectible || a instanceof Ball) continue;
			if (a.getRect().collide(rect1))
			{
				if (a instanceof Tank) {
					this.effect(a);
					this.destroy();
					return true;
				}
				this.bounce_count--;
				if (this.bounce_count <= 0)
					this.destroy();
				this.direction_impact = this.getBounce(a.getRect());
				return true;
			}
		}
		return false;
	}
	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.fillStyle = `#${((this.color.r << 16) | (this.color.g << 8) | this.color.b).toString(16).padStart(6,'0')}`; // HUH
		
		if (this.type == 'heal' || this.type == 'speed')
            ctx.strokeStyle = '#0000FF';
		else
            ctx.strokeStyle = '#FF0000';
		ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
}
