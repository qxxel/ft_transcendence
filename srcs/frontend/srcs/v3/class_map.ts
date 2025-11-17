import { Actor } from "./class_actor.js";
import { Wall } from "./class_wall.js";
import { GSTATE } from "./global.js";

export class Map {

    public walls: Actor[] = [];
  constructor(
    public map_width:number,
    public map_height:number,
    public wall_width: number, // TODO
    public name: string = "default"
  ) {
    if (this.name == "fy_snow") {
      this.generate_fy_snow();
    } else {
      this.generate_default();
    }
    console.log("C Map ", this.name, "with ", this.walls.length, "walls");
  }

  update(): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#040031ff';
    ctx.fillRect(0, 0, this.map_width, this.map_height);
      for(let w of this.walls) {
        w.draw(ctx);
      }
    }

  generate_fy_snow(): void {
    console.log("generate_fy_snow()");

    this.walls.push(new Wall(0, 0, 15, this.map_height, {r:0,g:0,b:255}));                    // EXTERIOR LEFT
    this.walls.push(new Wall(this.map_width - 15, 0, 15, this.map_height, {r:0,g:0,b:255}));  // EXTERIOR RIGHT
    this.walls.push(new Wall(0, 0, this.map_width, 15, {r:0,g:0,b:255}));                     // EXTERIOR TOP
    this.walls.push(new Wall(0, this.map_height - 15, this.map_width, 15, {r:0,g:0,b:255}));       // EXTERIOR BOT

    this.walls.push(new Wall(this.map_width / 5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));     // CUBE TOP LEFT
    this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE TOP RIGHT
    this.walls.push(new Wall(this.map_width / 5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE BOT LEFT
    this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255})); // CUBE BOT RIGHT

    console.log("generate_fy_snow() for()");
    for(let w of this.walls) {
      GSTATE.ACTORS.push(w);
    }
  }

    generate_default(): void {
    console.log("generate_default()");

    // this.walls.push(new Wall(0, 0, this.map_width, this.map_height, {r:0,g:0,b:255}));
    this.walls.push(new Wall(this.map_width / 5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));     // CUBE TOP LEFT
    this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE TOP RIGHT
    this.walls.push(new Wall(this.map_width / 5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255}));   // CUBE BOT LEFT
    this.walls.push(new Wall(this.map_width / 1.5, this.map_height / 1.5, this.map_width / 7, this.map_height / 7, {r:0,g:0,b:255})); // CUBE BOT RIGHT
    
    console.log("generate_default() for()");
    for(let w of this.walls) {
      GSTATE.ACTORS.push(w);
    }
  }
}
