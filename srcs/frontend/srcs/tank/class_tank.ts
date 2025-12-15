/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_tank.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:32:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 06:10:43 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS THAT DEFINES TANK ENTITIES, THEIR WEAPONS, ABILITIES, AND PLAYER CONTROLS

/* ============================= IMPORTS ============================= */

import { GSTATE }					from "./global.js"
import { Hud }						from "./class_hud.js"
import { Rect2D }					from "./class_rect.js"
import { Ball, Collectible, Pearl }	from "./class_ball.js"
import { Input } 					from "./class_input.js"
import { Actor }					from "./class_actor.js"
import { Cannon }					from "./class_cannon.js"

import type { Color, Keys }	from "./interface.js"

/* ============================= CLASS ============================= */

export class	Tank extends Actor {

	rect: Rect2D;
	cannon: Cannon[] = [];
	speed: number = 0;
	rot_speed: number = 0;
	health: number = 0;
	maxHealth: number = this.health;
	regen_rate: number = 0;
	regen_amount: number = 0;
	regen_last: number = 0;
	fire_rate: number = 0;
	fire_last: number = 0;
	ability_base_cooldown: number = 0;
	ability_cooldown: number = this.ability_base_cooldown;
	ability_duration: number = 0;
	ability_last: number = 0;
	ability_active: boolean = false;
	hud: Hud;
	ball_size: number = 0;
	ball_speed: number = 0;
	ball_speed_coef: number = 1;
	tank_speed_coef: number = 1;
	ability_base_cooldown_coeff: number = 1;
	fire_coef: number = 1;
	constructor(
		x:number,
		y:number,
		public w:number,
		public h:number,
		public	color:Color,
		public	fire_color:Color,
		public	keys:Keys,
		public  id:number) {
		super(x,y);

		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
		this.hud = new Hud(this.x,this.y,this.x + this.w, this.y, this.x + this.w/2,this.y,this.x + 50,this.y + 50,fire_color);
	}

	update(input: Input): void {
		this.listen(input);
		if (this.regen_rate != -1)
			this.regen();
		if (this.ability_update())
			this.ability_effect();
		if (Date.now() - this.fire_last <= (this.fire_rate * this.fire_coef))
			GSTATE.REDRAW = true;
		if (Date.now() - this.ability_last <= this.ability_base_cooldown * this.ability_base_cooldown_coeff)
			GSTATE.REDRAW = true;
	}

	draw(ctx: CanvasRenderingContext2D): void {
			this.rect.draw(ctx, this.color)
			for (let c of this.cannon)
				c.draw(ctx);

			if (!this.canFire()) {
				const	elapsed = Date.now() - this.fire_last;
				const	progress = Math.min(elapsed / ( this.fire_rate * this.fire_coef), 1);
				const	start = -Math.PI / 2;
				const	end = start + progress * Math.PI * 2;
				this.hud.wheel_draw(ctx,start,end);
			}
			if (!this.canAbility()) {
				this.hud.abilitybar_draw(ctx, Date.now() - this.ability_last, this.ability_cooldown);
			}
			if (this.health < this.maxHealth)
				this.hud.healthbar_draw(ctx,this.health,this.maxHealth);
	}

	listen(input: Input): void {
		if (input.isDown(this.keys.up)) {
				this.move(this.speed * this.tank_speed_coef * Math.cos(this.cannon[0].geometry.angle),this.speed * this.tank_speed_coef * Math.sin(this.cannon[0].geometry.angle));
			GSTATE.REDRAW = true;
		}
		if (input.isDown(this.keys.down)) {
				this.move(-this.speed * this.tank_speed_coef * Math.cos(this.cannon[0].geometry.angle),-this.speed * this.tank_speed_coef * Math.sin(this.cannon[0].geometry.angle));
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
			
		if (input.isPressed(this.keys.ability))	{ this.ability_cast(input); }
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

	setPos(dx:number,dy:number): void {
			this.y += dy;
			this.rect.y += dy;
			for (let c of this.cannon)
				c.move(0,dy);
			this.hud.move(0,dy);
			this.x += dx;
			this.rect.x += dx;
			for (let c of this.cannon)
				c.move(dx,0);
			this.hud.move(dx,0);
		}

	fire(): void {

		if (!this.canFire()) return;
		
		const	now = Date.now();
		let	isSpawnable:boolean;
		for (let c of this.cannon)
		{
			isSpawnable = true;
			let	spawnRect = new Rect2D(c.getEnd().x - this.ball_size / 2, c.getEnd().y - this.ball_size / 2, this.ball_size, this.ball_size);
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
							Math.cos(c.geometry.angle),
							Math.sin(c.geometry.angle),
							this.fire_color,
							this
						));
			}
		}
	}

	ability_cast(input: Input): void {
		if (!this.canAbility()) return;
		this.ability_cooldown = this.ability_base_cooldown * this.ability_base_cooldown_coeff;
		this.ability_active = true;
		this.ability_last = Date.now();
	}

	ability_effect(): void {
	}

	ability_off(): void {
		this.ability_active = false;
	}

	ability_update(): boolean {
		if (this.ability_active == false) return false;
		if (this.ability_active == true && !this.isAbility()) {
			this.ability_off();
			return false;
		}
		return true;
	}

	regen(): void {
		if (Date.now() - this.regen_rate < this.regen_last) return;
		this.addHealth(this.regen_amount);
		this.regen_last = Date.now();
		GSTATE.REDRAW = true;
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
		if (this.health + amount > this.maxHealth) {
			this.health = this.maxHealth;
			return; 
		}
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
		return Date.now() - this.fire_last > (this.fire_rate * this.fire_coef);
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

		this.speed = 0.95;
		this.rot_speed = 0.08
		this.health = 6.5;
		this.maxHealth = this.health;
		this.regen_rate = 1000;
		this.regen_amount = 0.04;
		this.fire_rate = 1250; // ms
		this.fire_last = 0;
		this.ability_base_cooldown = 9000; // ms
		this.ability_cooldown = this.ability_base_cooldown; // ms
		this.ability_duration = 1500; // ms
		this.ability_last = 0; // ms
		this.ability_active = false; // ms
		this.ball_size = 10;
		this.ball_speed = 3;
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),3,0,fire_color));
		this.hud.setShield(this.rect);
	}

	addHealth(amount:number): void {
		if (amount < 0 && this.isShield) return;
		super.addHealth(amount);
	}

	draw(ctx: CanvasRenderingContext2D): void {
		this.rect.draw(ctx, this.color)
		if (this.isShield)
			this.hud.shield_draw(ctx);
		if (!this.canFire()) {
			const	elapsed = Date.now() - this.fire_last;
			const	progress = Math.min(elapsed / (this.fire_rate * this.fire_coef), 1);
			const	start = -Math.PI / 2;
			const	end = start + progress * Math.PI * 2;
			this.hud.wheel_draw(ctx,start,end);
		}
		if (!this.canAbility()) {
			this.hud.abilitybar_draw(ctx, Date.now() - this.ability_last,this.ability_base_cooldown * this.ability_base_cooldown_coeff);
		}
		if (this.health < this.maxHealth)
			this.hud.healthbar_draw(ctx,this.health,this.maxHealth);
		for (let c of this.cannon)
			c.draw(ctx)
	}

	ability_effect(): void {
		if (!this.ability_active) return;
		this.isShield = true;
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
		this.ability_base_cooldown = 5750; // ms
		this.ability_cooldown = this.ability_base_cooldown; // ms
		this.ability_duration = 1000; // ms
		this.speed = 1.15
		this.rot_speed = 0.13
		this.health = 4
		this.fire_rate = 350
		this.maxHealth = this.health;
		this.regen_rate = 1000;
		this.regen_amount = 0.02;
		this.ball_size = 8;
		this.w *= 0.5;
		this.h *= 0.5;
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),3,0,fire_color));
	}

	ability_effect(): void {
		this.fire_rate = 100;
		this.fire();
	}
	ability_off(): void {
		this.fire_rate = 350;
	}
}

export class	Sniper extends Tank {

	ability_speed:number = 5;

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
		this.ability_base_cooldown = 5000; // ms
		this.ability_cooldown = this.ability_base_cooldown; // ms
		this.ability_duration = 0; // ms
		this.speed = 0.69
		this.rot_speed = 0.08
		this.health = 7
		this.fire_rate = 6000;
		this.maxHealth = this.health;
		this.regen_rate = 1000;
		this.regen_amount = 0.04;
		this.ball_size = 18.5;
		this.ball_speed = 3.5;
		this.w *= 0.9;
		this.h *= 0.9; 
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),6,0,fire_color));
	}

	ability_cast(): void {
		if (!this.canAbility()) return;
		this.ability_cooldown = this.ability_base_cooldown * this.ability_base_cooldown_coeff;

		const	now = Date.now();
		let	isSpawnable:boolean;
		for (let c of this.cannon)
		{
			isSpawnable = true;
			let	spawnRect = new Rect2D(c.getEnd().x - this.ball_size / 2, c.getEnd().y - this.ball_size / 2, this.ball_size, this.ball_size);
			for (let a of GSTATE.ACTORS) {
				if (a == this)
					continue;
				if (!(a instanceof Tank || a instanceof Ball) && a.getRect().collide(spawnRect)) {
					isSpawnable = false;
				}
			}
			if (isSpawnable)
			{
				this.ability_active = true;
				this.ability_last = now;
				GSTATE.ACTORS.push(
						new Pearl(
							c.getEnd().x - this.ball_size / 2,
							c.getEnd().y - this.ball_size / 2,
							this.ball_size/2,
							this.ball_size/2,
							Math.cos(c.geometry.angle),
							Math.sin(c.geometry.angle),
							this.fire_color,
							this
						));
			}
		}
	}

}

export class	Shotgun extends Tank {

	isDash:boolean = false;
	dash_direction:number = 1;
	dash_dx:number = 0;
	dash_dy:number = 0;
	dash_speed:number = 3;
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
		this.ability_base_cooldown = 3900; // ms
		this.ability_cooldown = this.ability_base_cooldown; // ms
		this.ability_duration = 350; // ms
		this.speed = 0.8;
		this.rot_speed = 0.1;
		this.health = 8;
		this.fire_rate = 4000;
		this.maxHealth = this.health;
		this.regen_rate = 800;
		this.regen_amount = 0.04;
		this.ball_size = 3;
		this.w *= 1.1;
		this.h *= 1.1; 
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 2),3,0,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 2.15),3,-Math.PI / 32,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 1.85),3,Math.PI / 32,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 2.3),3,-Math.PI / 16,fire_color));
		this.cannon.push(new Cannon(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h / 1.7),3,Math.PI / 16,fire_color));
	}

	ability_cast(input: Input): void {
		if (!this.canAbility()) return;
		this.ability_cooldown = this.ability_base_cooldown * this.ability_base_cooldown_coeff;
		this.ability_active = true;
		this.isDash = true;
		if (input.isDown(this.keys.down)) this.dash_direction = 0;
		this.dash_dx = Math.cos(this.cannon[0].geometry.angle);
		this.dash_dy = Math.sin(this.cannon[0].geometry.angle);
		this.ability_last = Date.now();
	}

	ability_effect(): void {
		if (!this.ability_active) return;

		if (this.dash_direction)
			this.move(this.dash_speed * this.dash_dx,this.dash_speed * this.dash_dy);
		else
			this.move(-this.dash_speed * this.dash_dx,-this.dash_speed * this.dash_dy);
	}

	ability_off(): void {
		this.isDash = false;
		this.dash_direction = 1;
	}

	listen(input: Input): void {
		
		if (input.isPressed(this.keys.fire))	{ this.fire(); }
			
		if (input.isPressed(this.keys.ability))	{ this.ability_cast(input); }

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

		if (this.isDash) return;

		if (input.isDown(this.keys.up)) {
				this.move((this.speed * this.tank_speed_coef) * Math.cos(this.cannon[0].geometry.angle),(this.speed * this.tank_speed_coef) * Math.sin(this.cannon[0].geometry.angle));
			GSTATE.REDRAW = true;
		}
		if (input.isDown(this.keys.down)) {
				this.move(-(this.speed * this.tank_speed_coef) * Math.cos(this.cannon[0].geometry.angle),-(this.speed * this.tank_speed_coef) * Math.sin(this.cannon[0].geometry.angle));
			GSTATE.REDRAW = true;
		}

	}


}
