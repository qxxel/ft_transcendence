import type { Color } from "./interface.js";

export class Rect2D {

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {}



  getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.w / 2,
      y: this.y + this.h / 2
    };
  }

  draw(ctx : CanvasRenderingContext2D, color: Color): void {
    ctx.fillStyle = `#${((color.r << 16) | (color.g << 8) | color.b).toString(16).padStart(6,'0')}`; // HUH
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  collide(other: Rect2D): boolean {
    if (other instanceof Rect2D) {
      return this.x < other.x + other.w &&
             this.x + this.w > other.x &&
             this.y < other.y + other.h &&
             this.y + this.h > other.y;
    }
    return false;
  }

  move(dx: number, dy: number): boolean {
    this.x += dx;
    this.y += dy;
    return false;
  }

  getX(): number { return this.x; }
  getY(): number { return this.y; }
  getW(): number { return this.w; }
  getH(): number { return this.h; }
  getA(): number { return 0; }
}