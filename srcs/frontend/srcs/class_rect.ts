export class Rect2D {

  x: number;
  y: number;
  w: number;
  h: number;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    c: number,
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx : CanvasRenderingContext2D): void {
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  getX(): number      { return this.x; }
  getY(): number      { return this.y; }
  getWidth(): number  { return this.w; }
  getHeight(): number { return this.h; }

  getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.w / 2,
      y: this.y + this.h / 2
    };
  }

}
