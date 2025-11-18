import { Actor } from "./class_actor.js";
import { Rect2D } from "./class_rect.js";
import { Color } from "./interface.js";

export class Wall extends Actor {

  rect: Rect2D;
  constructor(
    x:number,
    y:number,
    public w:number,
    public h:number,
    public color:Color) {
    super(x,y,false)
    this.rect = new Rect2D(this.x, this.y, this.w, this.h);
    console.log("C Wall at x:", x, "y:", y);
  }

  update(input: string[]): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    this.rect.draw(ctx, this.color)
   }

  getRect(): Rect2D { return this.rect; };

}