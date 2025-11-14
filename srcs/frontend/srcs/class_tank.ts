import { Ball } from './class_ball.js';

const tankWidth = 40;
const tankHeight = 40;
const tankSpeed = 2;
const rotationSpeed = 0.025;
const stickLength = 37;
const stickWidth = 8;

export class Tank {

  x: number;
  y: number;
  width: number;
  height: number;
  center_x: number;
  center_y: number;

  speed: number;
  aim: number;
  aim_x: number;
  aim_y: number;
  hits: number;
  key_up: string;
  key_down: string;
  key_left: string;
  key_right: string;
  key_rot_left: string;
  key_rot_right: string;
  key_fire: string;
  firerate: number;
  lastFireTime : number = 0;
  fireCooldown : number = 300;

  constructor(
    x: number,
    y: number,
    key_up: string,
    key_down: string,
    key_left: string,
    key_right: string,
    key_rot_left: string,
    key_rot_right: string,
    key_fire: string,
  ) {
    this.x = x;
    this.y = y;
    this.key_up = key_up,
    this.key_down = key_down,
    this.key_left = key_left,
    this.key_right = key_right,
    this.key_fire = key_fire,
    this.key_rot_left = key_rot_left,
    this.key_rot_right = key_rot_right,
    this.width = tankWidth;
    this.height = tankHeight;
    this.center_x = x + tankWidth / 2;
    this.center_y = y + tankHeight / 2;

    this.speed = tankSpeed;
    this.firerate = 100;

    this.aim = 0;
    this.aim_x = this.center_x + Math.cos(0) * stickLength;
    this.aim_y= this.center_y + Math.sin(0) * stickLength;

    this.hits = 0;
  }

  // TODO hyperchiant ca, je suis oblige de me trimballer canvas, p-e scaleup genre class Map idk
  update(canvas: HTMLCanvasElement, key: string): Ball | null {

    if (!key) return null; // p-e pas oblige

    if ([this.key_up, this.key_down, this.key_left, this.key_right, this.key_fire, this.key_rot_left, this.key_rot_right].includes(key)) {
      if (key == this.key_up && this.y > 0)                               this.moveUp();    this.updateAim();
      if (key == this.key_down && this.y < canvas!.height - this.height)  this.moveDown();  this.updateAim();
      if (key == this.key_left && this.x > 0)                             this.moveLeft();  this.updateAim();
      if (key == this.key_right && this.x < canvas!.width - this.width)   this.moveRight(); this.updateAim();
      if (key == this.key_rot_left)                                       this.aimLeft();   this.updateAim();
      if (key == this.key_rot_right)                                      this.aimRight();  this.updateAim();
      if (key == this.key_fire) return this.fire();
    }
    return null;
  }

  updateAim(): void {
    this.center_x = this.x + this.width / 2;
    this.center_y = this.y + this.height / 2;
    this.aim_x = this.center_x + Math.cos(this.aim) * stickLength;
    this.aim_y = this.center_y + Math.sin(this.aim) * stickLength;
  }

  keyMove(): void { this.y -= this.speed; }

  moveUp(): void    { this.y -= this.speed; }
  moveDown(): void  { this.y += this.speed; }
  moveLeft(): void  { this.x -= this.speed; }
  moveRight(): void { this.x += this.speed; }
  aimLeft(): void   { this.aim -= rotationSpeed; }
  aimRight(): void  { this.aim += rotationSpeed; }

  hit(): void { this.hits++; }

fire(): Ball | null{
  const now = Date.now();
  if (now - this.lastFireTime < this.fireCooldown) return null;


  this.lastFireTime = now;
  return new Ball(this.aim_x, this.aim_y, Math.cos(this.aim), Math.sin(this.aim));
}

  draw(ctx: CanvasRenderingContext2D): void {

    // BODY
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // CANNON
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = stickWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.center_x, this.center_y);
    ctx.lineTo(this.aim_x, this.aim_y);
    ctx.stroke();



    // END OF CANNON
    // ctx.fillStyle = '#dc2626';
    // ctx.beginPath();
    // ctx.arc(this.aim_x, this.aim_y, stickWidth - 2, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.arc(50, 50, stickWidth, 0, Math.PI * 2);
    // ctx.fillRect(this.aim_x - this.width / 4, this.aim_y - this.height / 4, this.width / 2, this.height / 2);
  }

}