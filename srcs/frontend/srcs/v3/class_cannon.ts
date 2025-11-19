import { Actor } from "./class_actor.js";
import type { Color, Keys } from "./interface.js";
import { Line2D } from "./class_line.js";

export class Cannon extends Actor {

  geometry: Line2D;

  constructor(
    public x1:number,
    public y1:number,
    public x2:number,
    public y2:number,
    public w:number,
    public h:number,
    public color:Color,
) {
    super(x1,y1)
    this.geometry = new Line2D(this.x1, this.y1, this.x2, this.y2, this.w, 0);
  }

  update(input: string[]): void {
  }

  draw(ctx: CanvasRenderingContext2D): void {
      this.geometry.draw(ctx, this.color);
  }

  move(dx:number,dy:number) {
    this.geometry.move(dx,dy);
  }

  getEnd(): { x: number; y: number } {
    return this.geometry.getEnd();
  }

  slope(angle: number): void {
    this.geometry.slope(angle);
  }

}