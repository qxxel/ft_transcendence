/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_cannon.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:25:34 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:29:04 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS THAT DEFINES A CANNON WITH POSITION, ANGLE, AND DRAW/MOVE FUNCTIONALITY


/* ============================= IMPORTS ============================= */

import { Actor }	from "./class_actor.js"
import { Line2D }	from "./class_line.js"
import { Input } 	from "./class_input.js"
import { Tank } 	from "./class_tank.js"

import type { Color } from "./interface.js"


/* ============================= CLASS ============================= */

export class	Cannon extends Actor {

	geometry: Line2D;

	constructor(
		public	x1:number,
		public	y1:number,
		public	x2:number,
		public	y2:number,
		public	w:number,
		public	angle:number,
		public	color:Color,
		public 	author?:Tank
) {
		super(x1,y1)
		this.geometry = new Line2D(this.x1, this.y1, this.x2, this.y2, this.w, this.angle);
	}

	update(input: Input): void {
	}

	draw(ctx: CanvasRenderingContext2D): void {
			this.geometry.draw(ctx, this.color);
	}

	move(dx:number,dy:number): void {
		this.geometry.move(dx,dy);
	}

	getEnd(): { x: number; y: number } {
			return this.geometry.getEnd();
	}

	slope(angle: number): void {
		this.geometry.slope(angle);
	}

}