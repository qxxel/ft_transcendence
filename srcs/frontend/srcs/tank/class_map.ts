/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_map.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:29:31 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 22:08:07 by kiparis          ###   ########.fr       */
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
		else if (this.name == "thehousemap") { this.generate_thehousemap(); }
		else if (this.name == "davinco") { this.generate_davinco(); }
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

		this.walls.push(new Wall(cell*1.5, cell*1.5, cell  , cell  ,   c_blk1)); // 1
		// this.walls.push(new Wall(cell*4, cell*1.5, cell*2, cell  ,   c_blk2)); // 2
		this.walls.push(new Wall(cell*7.5, cell*1.5, cell  , cell  ,   c_blk1)); // 3
		// this.walls.push(new Wall(cell*1.5, cell*4, cell  , cell*2,   c_blk2)); // 4
		this.walls.push(new Wall(cell*4, cell*4, cell*2, cell*2,   c_blk2)); // 5
		// this.walls.push(new Wall(cell*7.5, cell*4, cell  , cell*2,   c_blk2)); // 6
		this.walls.push(new Wall(cell*1.5, cell*7.5, cell  , cell  ,   c_blk1)); // 7
		// this.walls.push(new Wall(cell*4, cell*7.5, cell*2, cell  ,   c_blk2)); // 8
		this.walls.push(new Wall(cell*7.5, cell*7.5, cell  , cell  ,   c_blk1)); // 9

		for(let w of this.walls) {
			GSTATE.ACTORS.push(w);
		}

			this.spawns_tank1.push({x:cell*2 - 24,y:cell*1 - 24}); // a
			this.spawns_tank1.push({x:cell*1 - 24,y:cell*8 - 24}); // b
			this.spawns_tank2.push({x:cell*9 - 24,y:cell*2 - 24}); // c
			this.spawns_tank2.push({x:cell*8 - 24,y:cell*9 - 24}); // d

			this.spawns_collectible.push({x:cell*5.0 - 16/2,y: cell*3.5- 16/2});   // i
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*5.0- 16/2});   // j
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*5.0- 16/2});   // k
			this.spawns_collectible.push({x:cell*5.0 - 16/2,y: cell*6.5- 16/2});   // l
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*3.5- 16/2});   // w
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*3.5- 16/2});   // x
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*6.5- 16/2});   // y
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*6.5- 16/2});   // z

	}

	generate_thehousemap(): void {

		const c_ext  = {r:0,g:0,b:0};//675645
		const c_blk1 = {r:110,g:110,b:110};
		const c_blk2 = {r:160,g:160,b:160};

		const ext_width = 1;
		const cell =  this.map_height/100;

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

		// DOOR SIZE = 14
		// HOUSE WALLS

		this.walls.push(new Wall(cell*12, cell*12, cell  , cell * 12  ,   c_blk1)); // LEFT
		this.walls.push(new Wall(cell*12, cell*34, cell  , cell * 14  ,   c_blk1)); // LEFT
		this.walls.push(new Wall(cell*12, cell*55, cell  , cell * 15  ,   c_blk1)); // LEFT
		this.walls.push(new Wall(cell*12, cell*73, cell  , cell * 14  ,   c_blk1)); // LEFT

		
		// RIGHT TOP
        this.walls.push(new Wall(cell*87, cell*12, cell  , cell * 15  ,   c_blk1)); 
        this.walls.push(new Wall(cell*87, cell*30, cell  , cell * 2   ,   c_blk1)); 
        this.walls.push(new Wall(cell*87, cell*35, cell  , cell * 21  ,   c_blk1));


		this.walls.push(new Wall(cell*87, cell*70, cell  , cell * 17  ,   c_blk1)); // RIGHT BOT

		
		this.walls.push(new Wall(cell*12, cell*12, cell * 44  , cell  ,   c_blk1)); // TOP LEFT
		this.walls.push(new Wall(cell*70, cell*12, cell * 17  , cell  ,   c_blk1)); // TOP RIGHT

		this.walls.push(new Wall(cell*12, cell*87, cell * 12  , cell  ,   c_blk1)); // BOT LEFT
		this.walls.push(new Wall(cell*38, cell*87, cell * 15  , cell  ,   c_blk1)); // BOT MID LEFT
		this.walls.push(new Wall(cell*64, cell*87, cell * 10  , cell  ,   c_blk1)); // BOT MID RIGHT
		this.walls.push(new Wall(cell*85, cell*87, cell * 3  , cell  ,   c_blk1)); // BOT RIGHT


		// HORIZONTAL
        this.walls.push(new Wall(cell*12, cell*40, cell * 6   , cell  ,   c_blk1));
        this.walls.push(new Wall(cell*20, cell*40, cell * 2   , cell  ,   c_blk1));
        this.walls.push(new Wall(cell*24, cell*40, cell * 2   , cell  ,   c_blk1));
        this.walls.push(new Wall(cell*28, cell*40, cell * 4   , cell  ,   c_blk1));

        this.walls.push(new Wall(cell * 3, cell*65, cell   , cell  ,   c_blk1));
        this.walls.push(new Wall(cell * 8, cell*65, cell   , cell  ,   c_blk1));

        this.walls.push(new Wall(cell*46, cell*40, cell * 12  , cell  ,   c_blk1));  // MID MID

        // MID RIGHT
        this.walls.push(new Wall(cell*72, cell*40, cell * 6   , cell  ,   c_blk1));
        this.walls.push(new Wall(cell*81, cell*40, cell * 6   , cell  ,   c_blk1));

		// VERTICAL
		this.walls.push(new Wall(cell*50, cell*40, cell  , cell * 20  ,   c_blk1)); // MID 
		this.walls.push(new Wall(cell*50, cell*61, cell  , cell  ,   c_blk1)); // MID 
		this.walls.push(new Wall(cell*50, cell*63, cell  , cell  ,   c_blk1)); // MID 
		this.walls.push(new Wall(cell*50, cell*63, cell  , cell  ,   c_blk1)); // MID 
		this.walls.push(new Wall(cell*50, cell*65, cell  , cell  ,   c_blk1)); // MID 
		this.walls.push(new Wall(cell*50, cell*67, cell  , cell  ,   c_blk1)); // MID 
		this.walls.push(new Wall(cell*50, cell*69, cell  , cell  ,   c_blk1)); // MID 
		this.walls.push(new Wall(cell*50, cell*71, cell  , cell * 16  ,   c_blk1)); // MID 

		this.walls.push(new Wall(cell*67, cell*87, cell  , cell * 13  ,   c_blk1)); // MID 


		// FURNITURES

        this.walls.push(new Wall(cell*22, cell*50, cell * 5 , cell * 12 ,   c_blk1)); // ROOM BOT LEFT 
        this.walls.push(new Wall(cell*36, cell*64, cell * 5 , cell * 12 ,   c_blk1)); // ROOM BOT LEFT 
        this.walls.push(new Wall(cell*22, cell*19.5, cell * 10 , cell * 4 ,   c_blk1)); // ROOM TOP LEFT 
		


		for(let w of this.walls) {
			GSTATE.ACTORS.push(w);
		}

			this.spawns_tank1.push({x:cell*30,y:cell*30}); // d
			this.spawns_tank2.push({x:cell*60,y:cell*60}); // b

			this.spawns_collectible.push({x:cell*5.0 - 16/2,y: cell*3.5- 16/2});   // i
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*5.0- 16/2});   // j
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*5.0- 16/2});   // k
			this.spawns_collectible.push({x:cell*5.0 - 16/2,y: cell*6.5- 16/2});   // l
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*3.5- 16/2});   // w
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*3.5- 16/2});   // x
			this.spawns_collectible.push({x:cell*3.5 - 16/2,y: cell*6.5- 16/2});   // y
			this.spawns_collectible.push({x:cell*6.5 - 16/2,y: cell*6.5- 16/2});   // z

	}

	generate_davinco(): void {

		const c_ext  = {r:0,g:0,b:0};//675645
		const c_blk1 = {r:110,g:110,b:110};
		const c_blk2 = {r:160,g:160,b:160};

		const ext_width = 1;
		const cell =  this.map_height/100;

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



		for(let w of this.walls) {
			GSTATE.ACTORS.push(w);
		}

			this.spawns_tank1.push({x:cell*30,y:cell*30}); // d
			this.spawns_tank2.push({x:cell*60,y:cell*60}); // b

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
