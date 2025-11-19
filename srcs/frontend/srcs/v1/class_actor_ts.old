import { Circ2D, Mesh, Rect2D } from "./class_mesh";

export class Actor {

  meshs: Mesh[] = []
  constructor(
    m: Mesh,
  ) { this.meshs.push(m); }

  draw(ctx : CanvasRenderingContext2D): void {
    for (const m of this.meshs)
      m.draw(ctx);
  }

  addMesh(m: Mesh) {
    this.meshs.push(m);
  }
}
