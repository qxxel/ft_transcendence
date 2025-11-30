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

/* ============================= IMPORTS ============================= */

import { Actor }	from "./class_actor.js"
import { Tank }		from "./class_tank.js"
import { Ball }		from "./class_ball.js"
import { GSTATE }	from "./global.js"
import { Rect2D }	from "./class_rect.js"

import type { Color, Keys }	from "./interface.js"
import { Collectible } from "./class_collectible.js"

/* ============================= CLASS ============================= */

export class	HealthPack extends Collectible {

	rect: Rect2D;

	constructor(
		x:number,
		y:number,
		w:number,
		h:number,
		color:Color) {
		super(x,y,w,h,color);
		this.rect = new Rect2D(this.x, this.y, this.w, this.h);
	}

	getRect(): Rect2D { return this.rect; };

	effect(a: Tank) { a.addHealth(+1); }

}