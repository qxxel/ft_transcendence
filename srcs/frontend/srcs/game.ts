// Define interfaces for our game objects to keep things organized
interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number; // Velocity on the Y axis
  speed: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number; // Velocity on the X axis
  dy: number; // Velocity on the Y axis
  speed: number;
}

export class PongGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;

  private readonly initialBallSpeed: number = 5;
  private readonly maxBallSpeed: number = 12;
  private readonly ballSpeedIncrease: number = 0.5;

  private paddle1: Paddle;
  private paddle2: Paddle;
  private ball: Ball;

  private score1: number = 0;
  private score2: number = 0;
  private scoreElements: { p1: HTMLElement; p2: HTMLElement };

  private keysPressed: { [key: string]: boolean } = {};

  constructor(canvasId: string, score1Id: string, score2Id: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.scoreElements = {
        p1: document.getElementById(score1Id)!,
        p2: document.getElementById(score2Id)!
    };

    const paddleWidth = 10;
    const paddleHeight = 100;
    const paddleSpeed = 6;

    this.paddle1 = {
      x: 10,
      y: this.canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 0,
      speed: paddleSpeed,
    };

    this.paddle2 = {
      x: this.canvas.width - paddleWidth - 10,
      y: this.canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 0,
      speed: paddleSpeed,
    };

    this.ball = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 7,
      speed: this.initialBallSpeed,
      dx: 0,
      dy: 0,
    };
    
    this.resetBall(true);
    
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  private gameLoop() {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }
  
  private update() {
    this.movePaddles();
    this.moveAI();
    this.moveBall();
  }

  private draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height);
    this.ctx.fillRect(this.paddle2.x, this.paddle2.y, this.paddle2.width, this.paddle2.height);

    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#fff';
    this.ctx.setLineDash([10, 10]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
  }
  
  private movePaddles() {
    if (this.keysPressed['z'] && this.paddle1.y > 0) {
      this.paddle1.y -= this.paddle1.speed;
    }
    if (this.keysPressed['s'] && this.paddle1.y < this.canvas.height - this.paddle1.height) {
      this.paddle1.y += this.paddle1.speed;
    }
  }

  private moveBall() {
    // We store the previous position before moving the ball
    const prevBallX = this.ball.x - this.ball.dx;
    const prevBallY = this.ball.y - this.ball.dy;

    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0) {
      this.ball.dy *= -1;
    }
    
    // --- Player 1 Collision (Left Paddle) ---
    // The new logic checks if the paddle's front edge is between the ball's previous and current position.
    if (this.ball.dx < 0) { // Only check if ball is moving left
        const paddleFrontEdge = this.paddle1.x + this.paddle1.width;
        if (
            this.ball.x - this.ball.radius <= paddleFrontEdge &&
            prevBallX - this.ball.radius >= paddleFrontEdge &&
            this.ball.y > this.paddle1.y &&
            this.ball.y < this.paddle1.y + this.paddle1.height
        ) {
          this.calculateDeflection(this.paddle1);
          this.increaseBallSpeed();
        }
    }

    // --- Player 2 Collision (Right Paddle) ---
    if (this.ball.dx > 0) { // Only check if ball is moving right
        const paddleFrontEdge = this.paddle2.x;
        if (
            this.ball.x + this.ball.radius >= paddleFrontEdge &&
            prevBallX + this.ball.radius <= paddleFrontEdge &&
            this.ball.y > this.paddle2.y &&
            this.ball.y < this.paddle2.y + this.paddle2.height
        ) {
          this.calculateDeflection(this.paddle2);
          this.increaseBallSpeed();
        }
    }

    // Score points
    if (this.ball.x + this.ball.radius < 0) {
      this.score2++;
      this.updateScores();
      this.resetBall();
    } else if (this.ball.x - this.ball.radius > this.canvas.width) {
      this.score1++;
      this.updateScores();
      this.resetBall();
    }
  }

  private calculateDeflection(paddle: Paddle) {
    const relativeIntersectY = (paddle.y + (paddle.height / 2)) - this.ball.y;
    const normalizedIntersectY = relativeIntersectY / (paddle.height / 2);
    const maxBounceAngle = Math.PI / 6; // 30 deg
    const bounceAngle = normalizedIntersectY * maxBounceAngle;
    
    const direction = (this.ball.x < this.canvas.width / 2) ? 1 : -1;
    this.ball.dx = direction * this.ball.speed * Math.cos(bounceAngle);
    this.ball.dy = -1 * this.ball.speed * Math.sin(bounceAngle);
  }

  private increaseBallSpeed() {
    if (this.ball.speed >= this.maxBallSpeed) return;

    const newSpeed = Math.min(this.ball.speed + this.ballSpeedIncrease, this.maxBallSpeed);
    const magnitude = Math.sqrt(this.ball.dx ** 2 + this.ball.dy ** 2);
    
    if (magnitude > 0) {
      this.ball.dx = (this.ball.dx / magnitude) * newSpeed;
      this.ball.dy = (this.ball.dy / magnitude) * newSpeed;
      this.ball.speed = newSpeed;
    }
  }

  private resetBall(firstServe: boolean = false) {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    this.ball.speed = this.initialBallSpeed;

    const currentDirectionX = Math.sign(this.ball.dx);
    let directionX = firstServe ? (Math.random() < 0.5 ? 1 : -1) : currentDirectionX * -1;
    
    const angle = (Math.random() * Math.PI / 4) - (Math.PI / 8);
    
    this.ball.dx = directionX * this.ball.speed * Math.cos(angle);
    this.ball.dy = this.ball.speed * Math.sin(angle);
  }

  private updateScores() {
    this.scoreElements.p1.innerText = this.score1.toString();
    this.scoreElements.p2.innerText = this.score2.toString();
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.keysPressed[e.key] = true;
  }
  
  private handleKeyUp(e: KeyboardEvent) {
    this.keysPressed[e.key] = false;
  }
  
  public start() {
    if (!this.animationFrameId) {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      this.gameLoop();
      console.log('Game Started');
    }
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      this.animationFrameId = null;
      console.log('Game Stopped');
    }
  }

  private moveAI() {
    const paddleCenter = this.paddle2.y + this.paddle2.height / 2;
    
    if (paddleCenter < this.ball.y - 10) {
        this.paddle2.y += this.paddle2.speed;
    } else if (paddleCenter > this.ball.y + 10) {
        this.paddle2.y -= this.paddle2.speed;
    }

    if (this.paddle2.y < 0) this.paddle2.y = 0;
    if (this.paddle2.y > this.canvas.height - this.paddle2.height) {
        this.paddle2.y = this.canvas.height - this.paddle2.height;
    }
  }
}