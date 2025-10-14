interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
  speed: number;
  hits: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  speed: number;
}

export class PongGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;

  private isPaused: boolean = false;
  private isGameOver: boolean = false;
  private readonly winningScore: number = 5;

  private readonly initialBallSpeed: number = 5;
  private readonly maxBallSpeed: number = 12;
  private readonly ballSpeedIncrease: number = 0.5;

  private paddle1: Paddle;
  private paddle2: Paddle;
  private ball: Ball;

  private score1: number = 0;
  private score2: number = 0;
  private scoreElements: { p1: HTMLElement; p2: HTMLElement };

  private startTime: number = 0;
  private longestRally: number = 0;
  private currentRallyHits: number = 0;

  private keysPressed: { [key: string]: boolean } = {};

  constructor(canvasId: string, score1Id: string, score2Id: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.scoreElements = {
      p1: document.getElementById(score1Id)!,
      p2: document.getElementById(score2Id)!,
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
      hits: 0,
    };

    this.paddle2 = {
      x: this.canvas.width - paddleWidth - 10,
      y: this.canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 0,
      speed: paddleSpeed,
      hits: 0,
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
    if (this.isPaused || this.isGameOver) {
      return;
    }
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

    if (this.isPaused && !this.isGameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '50px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }

    if (this.isGameOver) {
     this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

     const winner = this.score1 >= this.winningScore ? 'Player 1' : 'Player 2';
     this.ctx.fillStyle = 'white';
     this.ctx.font = '50px monospace';
     this.ctx.textAlign = 'center';
     this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 60);
     this.ctx.font = '30px monospace';
     this.ctx.fillText(`${winner} Wins!`, this.canvas.width / 2, this.canvas.height / 2 - 10);
      
     this.ctx.font = '20px monospace';
     this.ctx.fillText("Press 'Space' to Restart", this.canvas.width / 2, this.canvas.height / 2 + 40);
} 
  }

  private movePaddles() {
    if ((this.keysPressed['w'] || this.keysPressed['z']) && this.paddle1.y > 0) {
      this.paddle1.y -= this.paddle1.speed;
    }
    if (this.keysPressed['s'] && this.paddle1.y < this.canvas.height - this.paddle1.height) {
      this.paddle1.y += this.paddle1.speed;
    }
  }

  private moveBall() {
    const prevBallX = this.ball.x - this.ball.dx;
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0) {
      this.ball.dy *= -1;
    }

    if (this.ball.dx < 0 && this.ball.x - this.ball.radius <= this.paddle1.x + this.paddle1.width && prevBallX - this.ball.radius >= this.paddle1.x + this.paddle1.width && this.ball.y > this.paddle1.y && this.ball.y < this.paddle1.y + this.paddle1.height) {
      this.calculateDeflection(this.paddle1);
      this.increaseBallSpeed();
    }

    if (this.ball.dx > 0 && this.ball.x + this.ball.radius >= this.paddle2.x && prevBallX + this.ball.radius <= this.paddle2.x && this.ball.y > this.paddle2.y && this.ball.y < this.paddle2.y + this.paddle2.height) {
      this.calculateDeflection(this.paddle2);
      this.increaseBallSpeed();
    }

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
    const maxBounceAngle = Math.PI / 3; // 60 degrees
    const bounceAngle = normalizedIntersectY * maxBounceAngle;
    const direction = (this.ball.x < this.canvas.width / 2) ? 1 : -1;
    this.ball.dx = direction * this.ball.speed * Math.cos(bounceAngle);
    this.ball.dy = -1 * this.ball.speed * Math.sin(bounceAngle);
    paddle.hits++;
    this.currentRallyHits++;
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
    console.log('ball reseted');
    this.longestRally = Math.max(this.longestRally, this.currentRallyHits);
    this.currentRallyHits = 0;
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
    if (!this.isGameOver && (this.score1 >= this.winningScore || this.score2 >= this.winningScore)) {
      this.isGameOver = true;
      this.showEndGameDashboard();
    }
  }
  
  private showEndGameDashboard() {
    const dashboard = document.getElementById('game-over-dashboard');
    if (!dashboard) return;
    const matchDurationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(matchDurationSeconds / 60);
    const seconds = matchDurationSeconds % 60;
    document.getElementById('stat-winner')!.innerText = this.score1 > this.score2 ? 'Player 1' : 'Player 2';
    document.getElementById('stat-duration')!.innerText = `${minutes}m ${seconds}s`;
    document.getElementById('stat-p1-hits')!.innerText = this.paddle1.hits.toString();
    document.getElementById('stat-p2-hits')!.innerText = this.paddle2.hits.toString();
    document.getElementById('stat-rally')!.innerText = this.longestRally.toString();
    dashboard.style.display = 'block';
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.isGameOver && e.key === ' ') {
        this.restart();
        return;
    }

    if (e.key === 'Escape' && !this.isGameOver) {
      this.isPaused = !this.isPaused;
    }
    
    this.keysPressed[e.key] = true;
}

  private handleKeyUp(e: KeyboardEvent) {
    this.keysPressed[e.key] = false;
  }

  public start() {
    if (!this.animationFrameId) {
      this.startTime = Date.now();
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      this.gameLoop();
      console.log('Game Started');
    }
  }

  private restart() {
    this.score1 = 0;
    this.score2 = 0;
    this.updateScores();

    this.paddle1.y = this.canvas.height / 2 - this.paddle1.height / 2;
    this.paddle1.hits = 0;
    this.paddle2.y = this.canvas.height / 2 - this.paddle2.height / 2;
    this.paddle2.hits = 0;

    this.isGameOver = false;
    this.isPaused = false;

    this.startTime = Date.now();
    this.longestRally = 0;
    this.currentRallyHits = 0;
    
    const dashboard = document.getElementById('game-over-dashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }

    this.resetBall(true);
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