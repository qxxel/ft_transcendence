import { Component } from "./class_component";
import { Mesh } from "./class_mesh";

export class Actor {

  constructor(public component: Component) {}

  draw(ctx : CanvasRenderingContext2D): void {
    // for (const m of this.component)
      // m.draw(ctx);
  }

  setComponent(c: Component) { this.component = c; }
  addMesh(m: Mesh) { this.component.addMesh(m); }


}
