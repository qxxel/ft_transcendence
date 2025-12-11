/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_ball.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:24:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 22:21:40 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { Actor }	from "./class_actor.js"
import { GSTATE }	from "./global.js"
import { Rect2D }	from "./class_rect.js"
import { Tank, Classic, Uzi, Sniper, Shotgun }		from "./class_tank.js"
import { Input }	from "./class_input.js"
import { Wall }			from "./class_wall.js"
import type { Color }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Ball extends Actor {

	rect: Rect2D;
	redraw: boolean = true;
	speed: number = 1;
	damage: number = 1;
	bounce_count: number = 3;
	health: number = 2;
	direction_impact: string = "";
	birth: number;
	opacity: number = 1;
	
	constructor(
		x:number,
		y:number,
		public	w:number,
		public	h:number,
		public	dx:number,
		public	dy:number,
		public	duration:number,
		public	color:Color,
		public	author?:Tank) {
		super(x,y)

		if (author)
		{
			if (author instanceof Sniper)
			{
				this.damage = 4;
				this.bounce_count = 2;
				this.speed = 0.9;
				this.health = 4;
				this.duration = 0;
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
			}
			else if (author instanceof Uzi)
			{
				this.damage = 0.5;
				this.bounce_count = 5;
				this.speed = 1.25;
				this.health = 1;
				this.duration = 3000;
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
			}
			else if (author instanceof Shotgun)
			{
				this.damage = 1.2;
				this.bounce_count = 2;
				this.speed = 1.25;
				this.health = 1;
				this.duration = 1500;
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
			}
			else //if (author instanceof Classic)
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		}
		else
			this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		this.birth = Date.now()
	}

	update(input: Input): void {
		this.move();
		this.desaturate();
		if (this.duration != 0 && Date.now() - this.birth  > this.duration)
		{
			this.destroy();
		}
		GSTATE.REDRAW = true;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
		ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
		ctx.fill();
	}

	move(): void {
	const future: Rect2D = new Rect2D(this.x + this.dx * this.speed, this.y + this.dy * this.speed, this.w, this.h);

	if (this.collide(future)) {
		if      (this.direction_impact == "vertical") this.dy = -this.dy;
		else if (this.direction_impact == "horizontal") this.dx = -this.dx;
	}
		this.x += this.dx * this.speed;
		this.y += this.dy * this.speed;
		this.rect.x += this.dx * this.speed;
		this.rect.y += this.dy * this.speed;
	}

	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
			if (a == this || a == this.author || a instanceof Collectible) continue;
			if (a.getRect().collide(rect1))
			{
				if (a instanceof Tank) {

					if (a instanceof Classic && a.isShield)
					{
						if (this.author && this.author.id == 0)
							GSTATE.STATS2.reflect += 1;
						else (this.author && this.author.id == 1)
							GSTATE.STATS1.reflect += 1;
						this.author = a;

						this.color = a.fire_color;
						if (this.bounce_count == 1) this.bounce_count++; // FORCE REBOUNCE IF BALL GONNA DIE IDK AYW.
					}
					else if (this.author)
					{
						if (this.author.id == 0)
							GSTATE.STATS1.hit += 1;
						else if (this.author.id == 1)
							GSTATE.STATS2.hit += 1;
						a.addHealth(-this.damage * this.opacity);
						this.destroy();
						return true;
					}
				}
				else if (a instanceof Ball) {
					if (this.author && a.author && this.author != a.author && !(a instanceof Pearl))
					{
						let tmp_damage:number = a.health;
						a.takeDamage(this.health);
						this.takeDamage(tmp_damage);
					}
					return false;
				}
				
				if (this.author!.id == 0)
					GSTATE.STATS1.bounce += 1;
				else
					GSTATE.STATS2.bounce += 1;

				this.bounce_count--;
				if (this.bounce_count <= 0)
				{
					this.destroy();
				}
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
	takeDamage(amount:number): void {
		this.health -= amount;
		if (this.health <= 0) {
			this.destroy();
		}
	}

	desaturate() : void
	{
		if (this.duration == 0)
			this.opacity = 1;
		else
			this.opacity = 1 - (   (Date.now() - this.birth)  / this.duration );
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

		super(x,y,w,h,0,0,0, {r:50,g:170,b:40});

		switch (this.type) {
        	case 'heal':
        		this.color = {r:50,g:170,b:40};
				break;
			case 'speed':
        		this.color = {r:50,g:150,b:255};
        	    break;
			case 'haste':
        		this.color = {r:100,g:50,b:150};
        	    break;
    	}
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
	}

	getRect(): Rect2D { return this.rect; };

	effect(a: Tank) {

		const b = new Actor(0,0);
		switch (this.type) {
			case 'heal':
				a.addHealth(1);
				break;
			case 'speed':
				a.speed = Math.min(a.speed+0.15, 2);
				break;
			case 'haste':
				a.fire_rate = Math.max(a.fire_rate-250, 500);
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
        ctx.strokeStyle = '#0000FF';
		ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
}


export class	Pearl extends Ball {

	impact_x:number = 0;
	impact_y:number = 0;
	impact_orientation: "horizontal" | "vertical" = "horizontal";

	constructor(
		x:number,
		y:number,
		public	w:number,
		public	h:number,
		public	dx:number,
		public	dy:number,
		public	color:Color,
		public	author?:Tank) {
		super(x,y,w,h,dx,dy,0,color,author);

		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
		ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
		ctx.fill();
	}

	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
			if (a == this || a == this.author || a instanceof Collectible) continue;
			if (a.getRect().collide(rect1))
			{
				if (a instanceof Classic && a.isShield)
				{
					this.author = a;
					this.color = a.fire_color;
					if (this.bounce_count == 1) this.bounce_count++; // FORCE REBOUNCE IF BALL GONNA DIE IDK AYW.
					this.direction_impact = this.getBounce(a.getRect());
					return true;
				}

				this.impact_x = rect1.x + rect1.w/2;
				this.impact_y = rect1.y + rect1.h/2;
				this.impact_orientation = this.getBounce(a.getRect());
				let spawnRect: Rect2D = new Rect2D(this.impact_x - this.author!.w/2, this.impact_y - this.author!.h/2, this.author!.w, this.author!.h);
				spawnRect = this.findSpawn(spawnRect);
				if (this.author && spawnRect != undefined) {
					this.author.setPos((spawnRect.x - this.author!.x), (spawnRect.y - this.author!.y));
				}
				this.destroy();
				return true;
			}
		}
		return false;
	}

	findSpawn(spawnRect:Rect2D): Rect2D {
		if (this.canSpawn(spawnRect)) return spawnRect;
		if (this.impact_orientation == 'horizontal')
		{
			if (this.dx >= 0)
				spawnRect.x -= 1; 
			else
				spawnRect.x += 1; 
		}
		else if (this.impact_orientation == 'vertical')
		{
			if (this.dy >= 0)
				spawnRect.y -= 1;
			else
				spawnRect.y += 1;
		}
		this.impact_orientation = this.impact_orientation == 'horizontal' ? 'vertical' : 'horizontal';
		return this.findSpawn(spawnRect);
	}

	canSpawn(rect1:Rect2D): boolean {
		if (rect1.x < 0 || rect1.x > GSTATE.CANVAS.width || rect1.y < 0 || rect1.y > GSTATE.CANVAS.height) return false;
		for (let a of GSTATE.ACTORS) {
			if (a == this || a == this.author || a instanceof Collectible) continue;
			if ((a instanceof Wall || a instanceof Tank) && a.getRect().collide(rect1))
			{
				return false;
			}	
		}
		return true;
	}

}
