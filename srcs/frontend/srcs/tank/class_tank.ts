/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_tank.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:32:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 22:40:35 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\

/* ============================= IMPORTS ============================= */

import { Actor }	from "./class_actor.js"
import { Ball, Collectible, Shield }		from "./class_ball.js"
import { Cannon }	from "./class_cannon.js"
import { GSTATE }	from "./global.js"
import { Hud }		from "./class_hud.js"
import { Rect2D }	from "./class_rect.js"
import { Input } 	from "./class_input.js";

import type { Color, Keys }	from "./interface.js"

/* ============================= CLASS ============================= */

export class	Tank extends Actor {

	rect: Rect2D;
	cannon: Cannon[] = [];
	speed: number = 0.80;
	rot_speed: number = 0.1;
	health: number = 6;
	maxHealth: number = this.health;
	fire_rate: number = 2000; // ms
	fire_last: number = 0;
	ability_cooldown: number = 5000; // ms
	ability_duration: number = 2000; // ms
	ability_last: number = 0; // ms
	ability_active: boolean = false; // ms
	hud: Hud;
	ball_size: number = 10;

	constructor(
		x:number,
		y:number,
		public w:number,
		public h:number,
		public	color:Color,
		public	fire_color:Color,
		public	keys:Keys,
		public  id:number) {
		super(x,y)
			
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		this.hud = new Hud(this.x,this.y,this.x + this.w, this.y, this.x + this.w/2,this.y,this.x + 50,this.y + 50,fire_color);
	}

	update(input: Input): void {
		this.listen(input);
		if (this.ability_update())
			this.ability_effect();
		if (Date.now() - this.fire_last <= this.fire_rate)
			GSTATE.REDRAW = true;
		if (Date.now() - this.ability_last <= this.ability_cooldown)
			GSTATE.REDRAW = true;
	}

	draw(ctx: CanvasRenderingContext2D): void {
			this.rect.draw(ctx, this.color)
			for (let c of this.cannon)
				c.draw(ctx);

			if (!this.canFire()) {
				const elapsed = Date.now() - this.fire_last;
				const progress = Math.min(elapsed / this.fire_rate, 1);
				const start = -Math.PI / 2;
				const end = start + progress * Math.PI * 2;
				this.hud.wheel_draw(ctx,start,end);
			}
			if (!this.canAbility()) {
				this.hud.abilitybar_draw(ctx, Date.now() - this.ability_last,this.ability_cooldown);
			}
			if (this.health < this.maxHealth)
				this.hud.healthbar_draw(ctx,this.health,this.maxHealth);

	}

	listen(input: Input): void {
		if (input.isDown(this.keys.up)) {
				this.move(this.speed * Math.cos(this.cannon[0].geometry.angle),this.speed * Math.sin(this.cannon[0].geometry.angle));
			GSTATE.REDRAW = true;
		}
		if (input.isDown(this.keys.down)) {
				this.move(-this.speed * Math.cos(this.cannon[0].geometry.angle),-this.speed * Math.sin(this.cannon[0].geometry.angle));
			GSTATE.REDRAW = true;
		}
		if (input.isDown(this.keys.left)) { 
			for (let c of this.cannon)
				c.slope(-this.rot_speed);
			GSTATE.REDRAW = true;
		}
		if (input.isDown(this.keys.right)) { 
			for (let c of this.cannon)
				c.slope(+this.rot_speed);
			GSTATE.REDRAW = true;
		}
		if (input.isPressed(this.keys.fire))	{ this.fire(); }
			
		if (input.isPressed(this.keys.ability))	{ this.ability_cast(); }
	}

	move(dx:number,dy:number): void {
		if (!this.collide(new Rect2D(this.x, this.y + dy, this.w, this.h))){
			this.y += dy;
			this.rect.y += dy;
			for (let c of this.cannon)
				c.move(0,dy);
			this.hud.move(0,dy);
		}
		if (!this.collide(new Rect2D(this.x + dx, this.y, this.w, this.h))){
			this.x += dx;
			this.rect.x += dx;
			for (let c of this.cannon)
				c.move(dx,0);
			this.hud.move(dx,0);
		}

	}

	fire(): void {

		if (!this.canFire()) return;
		
		const now = Date.now();
		let isSpawnable:boolean;
		for (let c of this.cannon)
		{
			isSpawnable = true;
			let spawnRect = new Rect2D(c.getEnd().x - this.ball_size / 2, c.getEnd().y - this.ball_size / 2, this.ball_size, this.ball_size);
			for (let a of GSTATE.ACTORS) {
				if (a == this)
					continue;
				if (!(a instanceof Tank || a instanceof Ball) && a.getRect().collide(spawnRect)) {
					isSpawnable = false;
				}
			}
			if (isSpawnable)
			{
				if (this.id == 0)
					GSTATE.STATS1.fire += 1;
				else
					GSTATE.STATS2.fire += 1;

				this.fire_last = now;
				GSTATE.ACTORS.push(
						new Ball(
							c.getEnd().x - this.ball_size / 2,
							c.getEnd().y - this.ball_size / 2,
							this.ball_size,
							this.ball_size,
							Math.cos(c.geometry.angle) * 3,
							Math.sin(c.geometry.angle) * 3,
							4500,
							this.fire_color,
							this
						));
			}
		}
	}

	ability_cast(): void {
		if (!this.canAbility()) return;
		this.ability_active = true;
		this.ability_last = Date.now();
	}

	ability_effect(): void {
		if (!this.ability_active) return;
	}

	ability_off(): void {
		if (!this.ability_active) return;
	}

	ability_update(): boolean {
		if (this.ability_active == true && !this.isAbility()) {
			this.ability_active = false;
			this.ability_off();
			return false;
		}
		return true;
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

	addHealth(amount:number): void {
		if (this.health + amount > this.maxHealth) return; 
		this.health += amount;

		if (this.health <= 0) {
			GSTATE.TANKS -= 1;
			if (this.id == 0)
			{
				GSTATE.STATS1.lose += 1;
				GSTATE.STATS2.win += 1;
			}
			else
			{
				GSTATE.STATS1.win += 1;
				GSTATE.STATS2.lose += 1;
			}
			this.destroy();
		}
	}

	canFire(): boolean {
		return Date.now() - this.fire_last > this.fire_rate;
	}
	canAbility(): boolean {
		return Date.now() - this.ability_last > this.ability_cooldown;
	}
	isAbility(): boolean {
		return Date.now() - this.ability_last < this.ability_duration;
	}
}

export class	Classic extends Tank {

	isShield:boolean = false;
	shield: Shield;
	constructor(
		x:number,
		y:number,
		public w:number,
		public h:number,
		public	color:Color,
		public	fire_color:Color,
		public	keys:Keys,
		public  id:number) {
		super(x,y,w,h,color,fire_color,keys,id);
		this.ability_cooldown = 3000; // ms
		this.ability_duration = 1000; // ms
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),3,0,fire_color));
		this.shield = new Shield(x,y,w,h,{r:100,g:120,b:255}, 0.9,this);
	}

	addHealth(amount:number): void {
		if (amount < 0 && this.isShield) return;
		super.addHealth(amount);
	}

	draw(ctx: CanvasRenderingContext2D): void {
		super.draw(ctx);
		if (this.isShield)
			this.shield.draw(ctx);
	}

	ability_effect(): void {
		if (!this.ability_active) return;
		this.isShield = true;
		this.shield.x = this.x;
		this.shield.y = this.y;
	}
	ability_off(): void {
		this.isShield = false;
	}
}

export class	Uzi extends Tank {

	constructor(
		x:number,
		y:number,
		public w:number,
		public h:number,
		public	color:Color,
		public	fire_color:Color,
		public	keys:Keys,
		public  id:number) {
		super(x,y, w * 0.5, h * 0.5 ,color,fire_color,keys,id);
		this.ability_cooldown = 5000; // ms
		this.ability_duration = 1000; // ms
		this.speed = 1.15
		this.rot_speed = 0.13
		this.health = 4
		this.fire_rate = 350
		this.maxHealth = this.health;
		this.ball_size = 8;
		this.w *= 0.5;
		this.h *= 0.5;
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),3,0,fire_color));
	}

	ability_effect(): void {
		if (!this.ability_active) return;
		this.fire_rate = 100;
		this.fire();
	}
	ability_off(): void {
		this.fire_rate = 350;
	}
}

export class	Sniper extends Tank {

	constructor(
		x:number,
		y:number,
		public w:number,
		public h:number,
		public	color:Color,
		public	fire_color:Color,
		public	keys:Keys,
		public  id:number) {

		
		super(x,y, w * 0.9, h * 0.9 ,color,fire_color,keys,id);
		this.ability_cooldown = 5000; // ms
		this.ability_duration = 1000; // ms
		this.speed = 0.65
		this.rot_speed = 0.08
		this.health = 7
		this.fire_rate = 6000;
		this.maxHealth = this.health;
		this.ball_size = 18.5;
		this.w *= 0.9;
		this.h *= 0.9; 
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),6,0,fire_color));
	}

	ability_effect(): void {
		if (!this.ability_active) return;
		console.log("SNI EFFECT!\n");
	}
}

export class	Shotgun extends Tank {

	constructor(
		x:number,
		y:number,
		public w:number,
		public h:number,
		public	color:Color,
		public	fire_color:Color,
		public	keys:Keys,
		public  id:number) {
		super(x,y, w * 1.1, h * 1.1 ,color,fire_color,keys,id);
		this.ability_cooldown = 5000; // ms
		this.ability_duration = 1000; // ms
		this.speed = 0.9
		this.rot_speed = 0.1
		this.health = 8
		this.fire_rate = 4000
		this.maxHealth = this.health;
		this.ball_size = 3;
		this.w *= 1.1;
		this.h *= 1.1; 
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 2),3,0,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 2.15),3,-Math.PI / 32,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 1.85),3,Math.PI / 32,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 2.3),3,-Math.PI / 16,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 1.7),3,Math.PI / 16,fire_color));
	}

	ability_effect(): void {
		if (!this.ability_active) return;
		console.log("SHO EFFECT!\n");
	}
}
