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

import { Actor }	from "./class_actor.js"
import { GSTATE }	from "./global.js"
import { Wall }		from "./class_wall.js"

import type { Spawn } from "./class_spawn.js"


/* ============================= CLASS ============================= */

export class	Map {

		public	walls: Actor[] = [];
		public	spawns_tank: Spawn[] = [];
		public	spawns_collectible: Spawn[] = [];
	constructor(
		public	map_width:number,
		public	map_height:number,
		public	wall_width: number, // TODO
		public	name: string = "default"
	) {
		if      (this.name == "fy_snow")   { this.generate_fy_snow(); }
		else if (this.name == "desertfox") { this.generate_desertfox(); }
		else { this.generate_default(); }

		console.log("C Map ", this.name, "with ", this.walls.length, "walls");
	}

	update(): void {}

	draw(ctx: CanvasRenderingContext2D): void {

		this.drawBackground(ctx);

		for(let w of this.walls) {
			w.draw(ctx);
		}
	}
		drawBackground(ctx: CanvasRenderingContext2D): void {
		// if      (this.name == "fy_snow") ctx.fillStyle = '#040031ff';
		// else if (this.name == "desertfox") ctx.fillStyle = '#675645'; //'#f3b48b';
		ctx.fillStyle = '#000000ff';
		ctx.fillRect(0, 0, this.map_width, this.map_height);
	}

	generate_fy_snow(): void {
		console.log("generate_fy_snow()");

		this.walls.push(new Wall(0, 0, 16, this.map_height, {r:0,g:0,b:255}));                    // EXTERIOR LEFT
		this.walls.push(new Wall(this.map_width - 16, 0, 16, this.map_height, {r:0,g:0,b:255}));  // EXTERIOR RIGHT
		this.walls.push(new Wall(0, 0, this.map_width, 16, {r:0,g:0,b:255}));                     // EXTERIOR TOP
		this.walls.push(new Wall(0, this.map_height - 16, this.map_width, 16, {r:0,g:0,b:255}));       // EXTERIOR BOT

		this.walls.push(new Wall(this.map_width / 5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));     // CUBE TOP LEFT
		this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE TOP RIGHT
		this.walls.push(new Wall(this.map_width / 5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE BOT LEFT
		this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255})); // CUBE BOT RIGHT

		for(let w of this.walls) {
			GSTATE.ACTORS.push(w);
		}
	}

		generate_desertfox(): void {
		console.log("generate_desertfox()");

		// const c_ext  = {r:165,g:136,b:122};675645
		// const c_blk1 = {r:84,g:60,b:44};
		// const c_blk2 = {r:223,g:145,b:94};
		const c_ext  = {r:0,g:0,b:0};//675645
		const c_blk1 = {r:110,g:110,b:110};
		const c_blk2 = {r:160,g:160,b:160};

		const ext_width = 16;
		const cell =  this.map_height/10; // IDK AM I DUMB


		console.log('ext_diwth',ext_width);
		console.log('cell_diwth',cell);
		this.walls.push(new Wall(0, 0, ext_width, this.map_height, c_ext));                           // EXTERIOR LEFT
		this.walls.push(new Wall(this.map_width - ext_width, 0, ext_width, this.map_height, c_ext));  // EXTERIOR RIGHT
		this.walls.push(new Wall(0, 0, this.map_width, ext_width, c_ext));                            // EXTERIOR TOP
		this.walls.push(new Wall(0, this.map_height - ext_width, this.map_width, ext_width, c_ext));  // EXTERIOR BOT

		this.walls.push(new Wall(45, 0, ext_width, this.map_height, c_ext));                          // SCOTCH EXTERIOR LEFT
		this.walls.push(new Wall(cell*9, 0, ext_width, this.map_height, c_ext));                      // SCOTCH EXTERIOR RIGHT
		this.walls.push(new Wall(0, 30, this.map_width, ext_width, c_ext));                           // SCOTCH EXTERIOR TOP
		this.walls.push(new Wall(0, this.map_height - 30 - ext_width, this.map_width, ext_width, c_ext));  // SCOTCH EXTERIOR BOT

// XXXXXXXXXX
// X a e    X
// X 1 22 3cX
// X  w  x  X
// X 4 55 6 X
// X 4 55 6 X
// X  y  z  X
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

			this.spawns_tank.push({x:cell*2.5 - 16/2,y:cell*1.5- 16/2}); // a
			// this.spawns_tank.push({x:cell*1.5 - 16/2,y:cell*7.5- 16/2}); // b
			// this.spawns_tank.push({x:cell*8.5 - 16/2,y:cell*2.5- 16/2}); // c
			// this.spawns_tank.push({x:cell*7.5 - 16/2,y:cell*8.5- 16/2}); // d
			this.spawns_tank.push({x:cell*3.5 - 16/2,y:cell*1.5- 16/2}); // e

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
