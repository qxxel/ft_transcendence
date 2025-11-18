import { Actor } from "./class_actor.js";
import { Rect2D } from "./class_rect.js";
import { Color, Keys } from "./interface.js";

export class Hud extends Actor {


  constructor(x:number,y:number,
    public wheel_x:number,
    public wheel_y:number,
    public wheel_color:Color
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