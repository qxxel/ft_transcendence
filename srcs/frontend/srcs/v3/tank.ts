import { Actor } from "./class_actor.js";
import { Input } from "./class_input.js";
import { GSTATE } from "./global.js";
import { Tank } from "./class_tank.js";
import { Map } from "./class_map.js";
import { Ball } from "./class_ball.js";
import { Color, Keys } from "./interface.js";

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
    map_name: string,
    nplayer: number,
    private gameMode: 'pvp' | 'ai' = 'ai',
  ) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.input = new Input();
    this.map = new Map(this.canvas.width, this.canvas.height, 2, map_name);

    let colors: Color[] = [];
    colors.push( {r:255,g:255,b:0} );
    colors.push( {r:255,g:0,b:255} );
    colors.push( {r:0,g:255,b:255} );
    colors.push( {r:255,g:255,b:255} );

    let keys: Keys[] = [];
    keys.push( {up:'w',down:'s',left:'a',right:'d',rot_left:'q',rot_right:'e',fire:' '} );
    keys.push( {up:'i',down:'k',left:'j',right:'l',rot_left:'u',rot_right:'o',fire:'z'} );
    keys.push( {up:'', down:'', left:'', right:'', rot_left:'', rot_right:'', fire:'x'} );
    keys.push( {up:'', down:'', left:'', right:'', rot_left:'', rot_right:'', fire:'c'} );

    let tank_width:number = 25;
    let tank_height:number = 25;

    if (map_name == 'desertfox')
    {
      for (let i = 0; i < nplayer; ++i)
      {
        GSTATE.ACTORS.push(
          new Tank(this.map.spawns[i].x, this.map.spawns[i].y, tank_width, tank_height, {r:0,g:255,b:0}, colors[i], keys[i]));
      }
    }
    else {
        GSTATE.ACTORS.push(
          new Tank(16,16,25,25, {r:0,g:255,b:0},{r:0,g:255,b:0},
            {up:"w",down:"s",left:"a",right:"d",rot_left:"q",rot_right:"e",fire:" "}));
    }
      // GSTATE.ACTORS.push(
        // new Tank(400,400,50,50, {r:0,g:255,b:0},
            // {up:"i",down:"k",left:"j",right:"l",fire:"u"}));

      // GSTATE.ACTORS.push(
      //   new Ball(450,16,16,16,3.5,7,
      //     {r:255,g:0,b:0}));

  }

  private gameLoop() {
    this.draw();
    this.update();
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  private update() {

    if (GSTATE.REDRAW) {
      // console.log("REDRAW");
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
