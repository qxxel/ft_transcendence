import { Actor } from "./class_actor.js";
import { Rect2D } from "./class_rect.js";
import { Color } from "./class_color.js";
import { Keys } from "./class_keys.js";
import { GSTATE } from "./global.js";
import { Ball } from "./class_ball.js";

export class Tank extends Actor {

  rect: Rect2D;
  redraw: boolean = true;
  speed: number = 5;
  health: number = 5;

  constructor(
    x:number,
    y:number,
    public w:number,
    public h:number,
    public color:Color,
    public keys:Keys) {
    super(x,y)
    this.rect = new Rect2D(this.x, this.y, this.w, this.h);
    console.log("C Tank at x:", x, "y:", y);
  }

  update(input: string[]): void {
    this.listen(input);
  }

  draw(ctx: CanvasRenderingContext2D): void {
      this.rect.draw(ctx, this.color)
   }

  listen(input: string[]): void {
    for (let inp of input) {
      if (inp == this.keys.up)    { this.move(0,-this.speed); GSTATE.REDRAW = true; }
      if (inp == this.keys.down)  { this.move(0,+this.speed); GSTATE.REDRAW = true; }
      if (inp == this.keys.left)  { this.move(-this.speed,0); GSTATE.REDRAW = true; }
      if (inp == this.keys.right) { this.move(+this.speed,0); GSTATE.REDRAW = true; }
      if (inp == this.keys.fire)  this.fire();
    }
  }

  move(dx:number,dy:number) {
    if (this.collide(new Rect2D(this.x + dx, this.y + dy, this.w, this.h)))
        return;
    this.x += dx;
    this.y += dy;
    this.rect.x += dx;
    this.rect.y += dy;
  }
  fire() { console.log("fire()"); }

  collide(rect1: Rect2D) {

    for (let a of GSTATE.ACTORS) {
      if (a == this || a instanceof Ball ) continue;
      if (a.getRect().collide(rect1))
      {
        return true;
      }
    }
    return false;
  }

  getRect(): Rect2D { return this.rect; };

  addHealth(amount:number): void { this.health += amount; }
}