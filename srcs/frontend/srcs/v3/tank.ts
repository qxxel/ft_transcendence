import { Actor } from "./class_actor.js";
import { Input } from "./class_input.js";
import { GSTATE } from "./global.js";
import { Tank } from "./class_tank.js";
import { Map } from "./class_map.js";
import { Ball } from "./class_ball.js";

export class TankGame {

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  // private ids: { canvas: string; score1: string; score2: string; winScore: string };

  private startTime: number = 0;
  private input: Input;
  private map: Map;


  constructor(
    canvasId: string, 
    nplayer: number,
    private gameMode: 'pvp' | 'ai' = 'ai',
  ) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.input = new Input();
    this.map = new Map(this.canvas.width, this.canvas.height, 2, "fy_snow");

      GSTATE.ACTORS.push(
        new Tank(50,50,50,50, {r:0,g:255,b:0},
            {up:"w",down:"s",left:"a",right:"d",fire:" "}));

      // GSTATE.ACTORS.push(
        // new Tank(400,400,50,50, {r:0,g:255,b:0},
            // {up:"i",down:"k",left:"j",right:"l",fire:"u"}));

      GSTATE.ACTORS.push(
        new Ball(350,100,15,15,3.5,7,
          {r:255,g:0,b:0}));

  }

  private gameLoop() {
    this.draw();
    this.update();
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  private update() {

    if (GSTATE.REDRAW) {
      console.log("REDRAW");
      this.map.draw(this.ctx);
      for (let a of GSTATE.ACTORS) {
          a.draw(this.ctx);
      }
      GSTATE.REDRAW = false;
    }
    for (let a of GSTATE.ACTORS) {
      a.update(this.input.getPressedKeys());
    }

  }

  public start() {
    if (!this.animationFrameId) {
      this.startTime = Date.now();
      this.input.start();
      this.gameLoop();
    }
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.input.stop();
      this.animationFrameId = null;
    for (let a of GSTATE.ACTORS)
      GSTATE.ACTORS.splice(0,GSTATE.ACTORS.length)
    console.log('TankGame Stopped');
    }

  }

  private draw() {}

}
