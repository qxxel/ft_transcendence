/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_ball.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:24:13 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:28:04 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS THAT HANDLES BALLS, COLLECTIBLES, AND THEIR COLLISIONS IN THE GAME


/* ============================= IMPORTS ============================= */

import { GSTATE }									from "./global.js"
import { Wall }										from "./class_wall.js"
import { Rect2D }									from "./class_rect.js"
import { Sniper, Shotgun }							from "./class_tank.js"
import { Tank, Classic, Uzi }						from "./class_tank.js"
import { Actor }									from "./class_actor.js"
import { Input }									from "./class_input.js"

import type { Color }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Ball extends Actor {

	rect: Rect2D;
	redraw: boolean = true;
	speed: number = 2.5;
	damage: number = 1;
	bounce_count: number = 3;
	health: number = 2;
	direction_impact: string = "";
	birth: number;
	opacity: number = 1;
	isReflected:boolean = false;
	ability_reduction:number = 0;
	duration:number = 0;
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

		if (this.author)
		{
			if (this.author instanceof Sniper)
			{
				this.damage = 4;
				this.bounce_count = 2;
				this.speed = this.author.ball_speed_coef * 3.75;
				this.health = 4;
				this.duration = 0;
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
			}
			else if (this.author instanceof Uzi)
			{
				this.damage = 0.5;
				this.bounce_count = 5;
				this.speed = this.author.ball_speed_coef * 2.25;
				this.health = 1;
				this.duration = 3000;
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
			}
			else if (this.author instanceof Shotgun)
			{
				this.damage = 1.2;
				this.bounce_count = 2;
				this.speed = this.author.ball_speed_coef * 3;
				this.health = 1;
				this.duration = 420;
				this.ability_reduction = 400;
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
			}
			else if (this.author instanceof Classic)
			{
				this.damage = 1;
				this.bounce_count = 3;
				this.speed = this.author.ball_speed_coef * 2.5;
				this.health = 2;
				this.duration = 4500;
				this.rect = new Rect2D(this.x, this.y, this.w, this.h);
			}
			else
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
		const	future: Rect2D = new Rect2D(this.x + this.dx * this.speed, this.y + this.dy * this.speed, this.w, this.h);
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
						else if (this.author && this.author.id == 1)
							GSTATE.STATS1.reflect += 1;
						this.author = a;
						this.isReflected = true;
						this.color = a.fire_color;
						this.birth = Date.now();
						if (this.bounce_count == 1) this.bounce_count++; // FORCE REBOUNCE IF BALL GONNA DIE IDK AYW.
					}
					else if (this.author)
					{
						if (this.author.id == 0 && this.isReflected == false)
							GSTATE.STATS1.hit += 1;
						else if (this.author.id == 1 && this.isReflected == false)
							GSTATE.STATS2.hit += 1;
						a.addHealth(-this.damage * this.opacity);
						if (this.author instanceof Shotgun && !this.author.canAbility()) this.author.ability_cooldown -= this.ability_reduction;
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
		const	dx = (this.x + this.w / 2) - (other.x + other.w / 2);
		const	dy = (this.y + this.h / 2) - (other.y + other.h / 2);

		const	overlapX = (this.w / 2 + other.w / 2) - Math.abs(dx);
		const	overlapY = (this.h / 2 + other.h / 2) - Math.abs(dy);
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
		if (this.duration == 0 || (this.author && this.author instanceof Shotgun))
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

		super(x,y,w,h,0,0, {r:50,g:170,b:40});

		switch (this.type) {
			case 'heal':
				this.color = {r:50,g:170,b:40};
				break;
			case 'tank_speed':
				this.color = {r:255,g:255,b:0};
				break;
			case 'ball_speed':
				this.color = {r:0,g:255,b:255};
				break;
			case 'haste':
				this.color = {r:239,g:19,b:19};
				break;
			case 'cdr':
				this.color = {r:247,g:0,b:255};
			break;
		}
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
	}

	getRect(): Rect2D { return this.rect; };

	effect(a: Tank) {

		const	b = new Actor(0,0);
		switch (this.type) {
			case 'heal':
				a.addHealth(4);
				break;
			case 'tank_speed':
				a.tank_speed_coef = Math.min(a.tank_speed_coef+0.1, 1.5)
				break;
			case 'ball_speed':
				a.ball_speed_coef = Math.min(a.ball_speed_coef+0.1, 1.5)
				break;
			case 'haste':
				a.fire_coef = Math.max(a.fire_coef-0.1, 0.5);
				break;
			case 'cdr':
				a.ability_base_cooldown_coeff = Math.max(a.ability_base_cooldown_coeff-0.1, 0.5);
				a.ability_cooldown = a.ability_base_cooldown * a.ability_base_cooldown_coeff;
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

	update(input: Input): void {
		this.move();
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
		ctx.strokeStyle = 'rgb(0,0,255)';
		ctx.lineWidth = 4;
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
		super(x,y,w,h,dx,dy,color,author);

		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		if (this.author) 
			this.speed = this.author.ball_speed_coef * 5;
		else
			this.speed = 5;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
		ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
		ctx.fill();
	}

	collide(rect1: Rect2D): boolean {

		for (let a of GSTATE.ACTORS) {
			if (a == this || a == this.author || a instanceof Collectible || (a instanceof Ball && a.author && a.author == this.author)) continue;
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
