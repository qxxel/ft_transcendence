import { Actor } from "./class_actor.js";
import { Rect2D } from "./class_rect.js";
import { Color } from "./class_color.js";
import { Keys } from "./class_keys.js";
import { GSTATE } from "./global.js";
import { Ball } from "./class_ball.js";
import { Line2D } from "./class_line.js";

export class Tank extends Actor {

  rect: Rect2D;
  cannon: Line2D;
  redraw: boolean = true;
  speed: number = 0.75;
  rot_speed: number = 0.05;
  health: number = 5;
  fire_rate: number = 2000; // ms
  fire_last: number = 0;
  fire_speed: number = 3;
  constructor(
    x:number,
    y:number,
    public w:number,
    public h:number,
    public color:Color,
    public fire_color:Color,
    public keys:Keys) {
    super(x,y)
    this.rect = new Rect2D(this.x, this.y, this.w, this.h);
    this.cannon = new Line2D(this.x + this.w/2, this.y + this.h/2, this.x + this.w, this.y + (this.h/2),
                            3,0);
    console.log("C Tank at x:", x, "y:", y);
  }

  update(input: string[]): void {
    this.listen(input);
    if (Date.now() - this.fire_last < this.fire_rate)
      GSTATE.REDRAW = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
      this.rect.draw(ctx, this.color)
      this.cannon.draw(ctx, {r:100,g:100,b:100});
      
      //TODO CLASS HUD
      if (Date.now() - this.fire_last < this.fire_rate) {
        const elapsed = Date.now() - this.fire_last;
        const progress = Math.min(elapsed / this.fire_rate, 1);

        const start = -Math.PI / 2;
        const end = start + progress * Math.PI * 2;

    const color = `#${((this.fire_color.r << 16) |
                       (this.fire_color.g << 8) |
                        this.fire_color.b)
                      .toString(16).padStart(6,'0')}`;

    ctx.beginPath();
    ctx.strokeStyle = `#${((this.fire_color.r << 16) | (this.fire_color.g << 8) | this.fire_color.b).toString(16).padStart(6,'0')}`; // HUH;
    ctx.lineWidth = 4;
    ctx.arc(this.x + this.w, this.y, 5, start, end);
    ctx.stroke();
      }
  }

  listen(input: string[]): void {
    for (let inp of input) {
      if (inp == this.keys.up)        { this.move(0,-this.speed); GSTATE.REDRAW = true; }
      if (inp == this.keys.down)      { this.move(0,+this.speed); GSTATE.REDRAW = true; }
      if (inp == this.keys.left)      { this.move(-this.speed,0); GSTATE.REDRAW = true; }
      if (inp == this.keys.right)     { this.move(+this.speed,0); GSTATE.REDRAW = true; }
      if (inp == this.keys.rot_left)  { this.cannon.slope(-this.rot_speed); GSTATE.REDRAW = true; }
      if (inp == this.keys.rot_right) { this.cannon.slope(+this.rot_speed); GSTATE.REDRAW = true; }
      if (inp == this.keys.fire) this.fire();
    }
  }

  move(dx:number,dy:number) {
    if (this.collide(new Rect2D(this.x + dx, this.y + dy, this.w, this.h)))
        return;
    this.x += dx;
    this.y += dy;
    this.rect.x += dx;
    this.rect.y += dy;
    this.cannon.x1 += dx;
    this.cannon.y1 += dy;
    this.cannon.x2 += dx;
    this.cannon.y2 += dy;
  }

  fire() {

    const now = Date.now(); // performance.now();
    if (now - this.fire_last < this.fire_rate) return;

    const spawnRect = new Rect2D(this.cannon.getEnd().x - 10/2 ,this.cannon.getEnd().y - 10/2 ,10,10);

    for (let a of GSTATE.ACTORS) {
      if (a == this) continue;
      if (a.getRect().collide(spawnRect))
      {
        return;
      }
    }

    this.fire_last = now;

    GSTATE.ACTORS.push(
        new Ball(this.cannon.getEnd().x - 10/2 ,this.cannon.getEnd().y - 10/2 ,10,10, Math.cos(this.cannon.angle) * 3, Math.sin(this.cannon.angle) * 3,
          this.fire_color, this));


    // GSTATE.ACTORS.push(
        // new Ball(this.x + this.w/2 + 25,this.y + this.h/2 - 7.5,16,16,5,0,
          // {r:255,g:0,b:0}));
   }

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

  addHealth(amount:number): void { // TODO parceque la c'est un peu hardcode quoi
    this.health += amount;
    this.color.r += 50;
    this.color.g -= 50;
    console.log("health():",this.health);
    if (this.health == 0) this.destroy();
  }
}