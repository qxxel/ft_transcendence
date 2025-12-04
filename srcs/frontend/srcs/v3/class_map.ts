/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_map.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:29:31 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:30:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { Actor }		from "./class_actor.js"
import { GSTATE }		from "./global.js"
import { Wall }			from "./class_wall.js"
import type { Spawn }	from "./global.js"


/* ============================= CLASS ============================= */

export class	Map {

		public	walls: Actor[] = [];
		public	spawns_tank1: Spawn[] = [];
		public	spawns_tank2: Spawn[] = [];
		public	spawns_collectible: Spawn[] = [];
	constructor(
		public	map_width:number,
		public	map_height:number,
		public	wall_width: number, // TODO
		public	name: string = "default",
	) {
		if (this.name == "desertfox") { this.generate_desertfox(); }
		else { this.generate_default(); }
	}

	update(): void {}

	draw(ctx: CanvasRenderingContext2D): void {

		this.drawBackground(ctx);

		for(let w of this.walls) {
			w.draw(ctx);
		}
	}
		drawBackground(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = '#000000ff';
		ctx.fillRect(0, 0, this.map_width, this.map_height);
	}

	generate_desertfox(): void {

		const c_ext  = {r:0,g:0,b:0};//675645
		const c_blk1 = {r:110,g:110,b:110};
		const c_blk2 = {r:160,g:160,b:160};

		const ext_width = 1;
		const cell =  this.map_height/10;

		this.walls.push(new Wall(0, 0, ext_width, this.map_height, c_ext));                           // EXTERIOR LEFT
		this.walls.push(new Wall(this.map_width - ext_width, 0, ext_width, this.map_height, c_ext));  // EXTERIOR RIGHT
		this.walls.push(new Wall(0, 0, this.map_width, ext_width, c_ext));                            // EXTERIOR TOP
		this.walls.push(new Wall(0, this.map_height - ext_width, this.map_width, ext_width, c_ext));  // EXTERIOR BOT

// XXXXXXXXXX
// X a e    X
// X 1 22 3cX
// X  wi x  X
// X 4j55k6 X
// X 4 55 6 X
// X  yl z  X
// Xb7 88 9 X
// X      d X
// XXXXXXXXXX

		this.walls.push(new Wall(cell*2, cell*2, cell  , cell  ,   c_blk1)); // 1
		this.walls.push(new Wall(cell*4, cell*2, cell*2, cell  ,   c_blk2)); // 2
		this.walls.push(new Wall(cell*7, cell*2, cell  , cell  ,   c_blk1)); // 3
		this.walls.push(new Wall(cell*2, cell*4, cell  , cell*2,   c_blk2)); // 4
		this.walls.push(new Wall(cell*4, cell*4, cell*2, cell*2,   c_blk2)); // 5
		this.walls.push(new Wall(cell*7, cell*4, cell  , cell*2,   c_blk2)); // 6
		this.walls.push(new Wall(cell*2, cell*7, cell  , cell  ,   c_blk1)); // 7
		this.walls.push(new Wall(cell*4, cell*7, cell*2, cell  ,   c_blk2)); // 8
		this.walls.push(new Wall(cell*7, cell*7, cell  , cell  ,   c_blk1)); // 9

		for(let w of this.walls) {
			GSTATE.ACTORS.push(w);
		}

			this.spawns_tank1.push({x:cell*2.5 - 32/2,y:cell*1.5 - 32/2}); // a
			this.spawns_tank1.push({x:cell*1.5 - 32/2,y:cell*7.5 - 32/2}); // b
			this.spawns_tank2.push({x:cell*8.5 - 32/2,y:cell*2.5 - 32/2}); // c
			this.spawns_tank2.push({x:cell*7.5 - 32/2,y:cell*8.5 - 32/2}); // d

			this.spawns_collectible.push({x:cell*5.0 - 16/2,y: cell*3.5- 16/2});   // i
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*5.0- 16/2});   // j
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*5.0- 16/2});   // k
			this.spawns_collectible.push({x:cell*5.0 - 16/2,y: cell*6.5- 16/2});   // l
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*3.5- 16/2});   // w
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*3.5- 16/2});   // x
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*6.5- 16/2});   // y
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*6.5- 16/2});   // z

	}
		generate_default(): void {
		console.log("generate_default()");

		// this.walls.push(new Wall(0, 0, this.map_width, this.map_height, {r:0,g:0,b:255}));
		this.walls.push(new Wall(this.map_width / 5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));     // CUBE TOP LEFT
		this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE TOP RIGHT
		this.walls.push(new Wall(this.map_width / 5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE BOT LEFT
		this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255})); // CUBE BOT RIGHT
		
		for(let w of this.walls) {
			GSTATE.ACTORS.push(w);
		}
	}
}
