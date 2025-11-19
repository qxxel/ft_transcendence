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

import type { Color }	from "./interface.js"


/* ============================= CLASS ============================= */

export class	Hud extends Actor {


	constructor(x:number,y:number,
		public	wheel_x:number,
		public	wheel_y:number,
		public	wheel_color:Color
	) {
		super(x,y);

	}

	update(input: string[]): void {
		
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

	move(dx:number,dy:number) {
		this.x += dx;
		this.y += dy;
		this.wheel_x += dx;
		this.wheel_y += dy;
	}
}