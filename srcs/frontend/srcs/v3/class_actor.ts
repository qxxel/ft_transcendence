import { Rect2D } from "./class_rect.js";
import { GSTATE } from "./global.js";

export class Actor {


  constructor(
    public x:number,
    public y:number,
    public isMovable:boolean = true) {
    console.log("C Actor at x:", x, "y:", y);
  }

  update(input: string[]): void {}

  draw(ctx: CanvasRenderingContext2D): void {}

  getRect(): Rect2D { return new Rect2D(0,0,0,0); };

  destroy(): void {
    GSTATE.ACTORS = GSTATE.ACTORS.filter(a => a !== this);
  }
}