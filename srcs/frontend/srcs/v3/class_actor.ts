/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_actor.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:22:15 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:23:17 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { GSTATE } from "./global.js";
import { Rect2D } from "./class_rect.js";


/* ============================= CLASS ============================= */

export class	Actor {

	constructor(
		public	x:number,
		public	y:number) {
		console.log("C Actor at x:", x, "y:", y);
	}

	update(input: string[]): void {}

	draw(ctx: CanvasRenderingContext2D): void {}

	getRect(): Rect2D { return new Rect2D(0,0,0,0); };

	destroy(): void {
		GSTATE.ACTORS = GSTATE.ACTORS.filter(a => a !== this);
	}
}