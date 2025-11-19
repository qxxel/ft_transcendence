import { Tank } from './class_tank.js';
import { Ball } from './class_ball.js';

export class TankGame {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;

  private isPaused: boolean = false;
  private isGameOver: boolean = false;
  private winningScore: number = 5;

  private readonly initialBallSpeed: number = 5;
  private readonly maxBallSpeed: number = 12;
  private readonly ballSpeedIncrease: number = 0.5;

  private gameMode: 'pvp' | 'ai';
  private aiLastDecisionTime: number = 0;
  private aiTargetY: number = 0;

  // private tank1: Tank;
  // private tank2: Tank;
  // private ball: Ball;
  private tanks: Tank[] = [];
  private balls: Ball[] = [];
  private score1: number = 0;
  private score2: number = 0;
  private scoreElements: { winScore: HTMLElement; p1: HTMLElement; p2: HTMLElement } | null = null;

  private startTime: number = 0;
  private longestRally: number = 0;
  private currentRallyHits: number = 0;

  private ids: { canvas: string; score1: string; score2: string; winScore: string };
  private keysPressed: { [key: string]: boolean } = {};

  constructor(
    canvasId: string, 
    score1Id: string, 
    score2Id: string, 
    winScoreId: string, 
    gameMode: 'pvp' | 'ai' = 'ai'
  ) {
    this.ids = {
      canvas: canvasId,
      score1: score1Id,
      score2: score2Id,
      winScore: winScoreId
    };
    this.canvas! = document.getElementById(this.ids.canvas) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.scoreElements! = {
      winScore: document.getElementById(this.ids.winScore)!,
      p1: document.getElementById(this.ids.score1)!,
      p2: document.getElementById(this.ids.score2)!
    };

    this.scoreElements.winScore.innerHTML = this.winningScore.toString();
    
    const tankWidth = 10;
    const tankHeight = 100;
    const tankSpeed = 6;


    this.tanks.push(new Tank(10, this.canvas!.height / 2 - tankHeight / 2,
                'w','s','a','d', 'q', 'e', ' '));
    this.tanks.push(new Tank(this.canvas!.width - tankWidth - 10, this.canvas!.height / 2 - tankHeight / 2,
                'i','k','j','l', 'u', 'o', 'n'));

    this.aiTargetY = this.canvas!.height / 2;

    // this.resetBall(true);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.gameMode = gameMode;
  }

  public setCtx() {

  }

  // Main game loop that runs at ~60 FPS - updates game state and renders graphics
  private gameLoop() {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  private update() {
    if (this.isPaused || this.isGameOver) { return; }
    // console.log("keyPressed:", key);
    // console.log("now:", Date.now());

    this.updateTanks();
    this.updateBalls();
  }

  private updateTanks() {
  for (const key in this.keysPressed) {
    if (!this.keysPressed[key])
      continue;

  for(const tank of this.tanks) {
      let ball = tank.update(this.canvas!, key);
      if (ball) this.balls.push(ball);
      // this.balls.push(ball);
    }
  }
}

  private updateBalls() {

    for(const ball of this.balls) {
      this.balls = this.balls.filter(ball => !ball.update(this.canvas!)); // WTF
    }

  }

  private updateScores() {
    this.scoreElements!.p1.innerText = this.score1.toString();
    this.scoreElements!.p2.innerText = this.score2.toString();
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
    document.getElementById('stat-p1-hits')!.innerText = this.tanks[0]!.hits.toString();
    document.getElementById('stat-p2-hits')!.innerText = this.tanks[1]!.hits.toString();
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

    this.tanks[0]!.y = this.canvas!.height / 2 - this.tanks[0]!.height / 2;
    this.tanks[0]!.hits = 0;
    this.tanks[1]!.y = this.canvas!.height / 2 - this.tanks[1]!.height / 2;
    this.tanks[1]!.hits = 0;

    this.isGameOver = false;
    this.isPaused = false;

    this.startTime = Date.now();
    this.longestRally = 0;
    this.currentRallyHits = 0;
    
    const dashboard = document.getElementById('game-over-dashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }

    // this.resetBall(true);
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

  public setWinningScore(newWinningScore: number) {
    this.winningScore = newWinningScore;
  }

  private draw() {
    this.ctx!.fillStyle = '#000';
    this.ctx!.fillRect(0, 0, this.canvas!!.width, this.canvas!!.height);

    this.ctx!.fillStyle = '#fff';

    for (const tank of this.tanks) {
      tank.draw(this.ctx!);
    }
    for (const ball of this.balls) {
      ball.draw(this.ctx!);
    }

    this.ctx!.strokeStyle = '#fff';
    this.ctx!.setLineDash([10, 10]);
    this.ctx!.beginPath();
    this.ctx!.moveTo(this.canvas!.width / 2, 0);
    this.ctx!.lineTo(this.canvas!.width / 2, this.canvas!.height);
    this.ctx!.stroke();
    this.ctx!.setLineDash([]);

    if (this.isPaused && !this.isGameOver) {
      this.ctx!.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
      this.ctx!.fillStyle = 'white';
      this.ctx!.font = '50px monospace';
      this.ctx!.textAlign = 'center';
      this.ctx!.fillText('PAUSED', this.canvas!.width / 2, this.canvas!.height / 2);
    }

    if (this.isGameOver) {
     this.ctx!.fillStyle = 'rgba(0, 0, 0, 0.7)';
     this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);

     const winner = this.score1 >= this.winningScore ? 'Player 1' : 'Player 2';
     this.ctx!.fillStyle = 'white';
     this.ctx!.font = '50px monospace';
     this.ctx!.textAlign = 'center';
     this.ctx!.fillText('GAME OVER', this.canvas!.width / 2, this.canvas!.height / 2 - 60);
     this.ctx!.font = '30px monospace';
     this.ctx!.fillText(`${winner} Wins!`, this.canvas!.width / 2, this.canvas!.height / 2 - 10);
      
     this.ctx!.font = '20px monospace';
     this.ctx!.fillText("Press 'Space' to Restart", this.canvas!.width / 2, this.canvas!.height / 2 + 40);
    }
  }
}


