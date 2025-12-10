/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_hud.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:26:46 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:27:36 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { Actor }	from "./class_actor.js"
import { Input } 	from "./class_input.js";
import { Rect2D } from "./class_rect.js";

import type { Color }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Hud extends Actor {


	constructor(x:number,y:number,
		public	wheel_x:number,
		public	wheel_y:number,
		public	healthbar_x:number,
		public	healthbar_y:number,
		public	abilitybar_x:number,
		public	abilitybar_y:number,
		public	wheel_color:Color,
		public	shield?:Rect2D
	) {
		super(x,y);

	}

	update(input: Input): void {
		
	}

	draw(ctx: CanvasRenderingContext2D): void {

	}

	wheel_draw(ctx: CanvasRenderingContext2D, start:number,end:number): void {

		ctx.beginPath();
		ctx.strokeStyle = `#${((this.wheel_color.r << 16) | (this.wheel_color.g << 8) | this.wheel_color.b).toString(16).padStart(6,'0')}`; // HUH;
		ctx.lineWidth = 4;
		ctx.arc(this.wheel_x, this.wheel_y, 5, -Math.PI / 2, end);
		ctx.stroke();
	}

	healthbar_draw(ctx: CanvasRenderingContext2D, health:number, maxHealth:number): void {
		const barWidth = 40;
		const barHeight = 6;
		const offsetY = -20;

		const ratio = Math.max(0, Math.min(1, health / maxHealth));

		ctx.fillStyle = "#444";
		ctx.fillRect(this.healthbar_x - barWidth / 2, this.healthbar_y + offsetY, barWidth, barHeight);

		ctx.fillStyle = "#00cc00";
		ctx.fillRect(this.healthbar_x - barWidth / 2, this.healthbar_y + offsetY, barWidth * ratio, barHeight);

	}

	abilitybar_draw(ctx: CanvasRenderingContext2D, ability_last:number, ability_cooldown:number): void {
		const barWidth = 40;
		const barHeight = 6;
		const offsetY = -10;

		const ratio = Math.max(0, Math.min(1, ability_last / ability_cooldown));

		ctx.fillStyle = "#444";
		ctx.fillRect(this.healthbar_x - barWidth / 2, this.healthbar_y + offsetY, barWidth, barHeight);

		ctx.fillStyle = "#bb00ffff";
		ctx.fillRect(this.healthbar_x - barWidth / 2, this.healthbar_y + offsetY, barWidth * ratio, barHeight);

	}

	shield_draw(ctx: CanvasRenderingContext2D, color:Color, opacity:number): void {
		const barWidth = 40;
		const barHeight = 6;
		const offsetY = -10;

		if (!this.shield) return;
 
		// ctx.fillStyle = "#00000FF";
		// ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b})`;
		ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
		ctx.strokeRect(this.shield.x, this.shield.y, this.shield.w + 8, this.shield.h + 8);
		ctx.strokeRect(this.shield.x-16, this.shield.y-16, this.shield.w + 32, this.shield.h + 32);
	}

	move(dx:number,dy:number) {
		this.x += dx;
		this.y += dy;
		this.wheel_x += dx;
		this.wheel_y += dy;
		this.healthbar_x += dx;
		this.healthbar_y += dy;
		this.abilitybar_x += dx;
		this.abilitybar_y += dy;
		if (this.shield)
			this.shield?.move(dx,dy);
	}
}