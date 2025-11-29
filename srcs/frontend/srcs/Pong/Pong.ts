/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Pong.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:02:06 by kiparis           #+#    #+#             */
/*   Updated: 2025/11/29 10:36:29 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// MAIN PONG GAME CONTROLLER

/* ====================== IMPORTS ====================== */

import { Game } from "./GameClass.js"
import { Router } from "../router/router.js";
import { User } from "../user/user.js";
import { AIController } from "./AI.js";
import { PongRenderer } from "./Renderer.js";
import { PongPhysics } from "./Physics.js";
import type { GameState } from "../index.js";

/* ====================== INTERFACES ====================== */

export interface Paddle { x: number; y: number; width: number; height: number; dy: number; speed: number; hits: number; }
export interface Ball { x: number; y: number; radius: number; dx: number; dy: number; speed: number; lastHitter: number; }

export interface Collectible { 
    id: number; 
    x: number; 
    y: number; 
    radius: number; 
    dy: number;
    active: boolean;
    type: string;
}

/* ====================== CLASS ====================== */

export class PongGame extends Game {
  private canvas: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;

  // Sub-systems
  private renderer: PongRenderer | null = null;
  private physics: PongPhysics | null = null;
  private aiController: AIController;

  // Game State
  private isPaused: boolean = false;
  private isGameOver: boolean = false;
  private winningScore: number = 5;
  private gameMode: 'pvp' | 'ai';
  private aiDifficulty: 'easy' | 'medium' | 'hard' | 'boris';
  private isTournamentMatch: boolean = false;

  // Objects
  private paddle1: Paddle | null = null;
  private paddle2: Paddle | null = null;
  private ball: Ball | null = null;

  // Collectibles
  private collectibles: Collectible[] = [];
  private lastCollectibleSpawn: number = 0;
  private powerupFrequency: number = 5; // Default 5 seconds
  private nextCollectibleId: number = 0;
  private star1: boolean = false;
  private star2: boolean = false;
  private star3: boolean = false;

  // Data
  private player1Name: string | undefined = "Player 1";
  private player2Name: string | undefined = "Player 2";
  private score1: number = 0;
  private score2: number = 0;
  private scoreElements: { winScore: HTMLElement; p1: HTMLElement; p2: HTMLElement } | null = null;
  
  // Stats
  private startTime: number = 0;
  private longestRally: number = 0;
  private currentRallyHits: number = 0;

  private ids: { canvas: string; score1: string; score2: string; winScore: string };
  private keysPressed: { [key: string]: boolean } = {};

  private router: Router;
  private gameState: GameState;
  private user: User;
  private readonly initialBallSpeed: number = 5;

  private paddleWidth = 10;
  private paddleHeight = 100;
  private paddleSpeed = 6;

  constructor(canvasId: string, 
      score1Id: string, 
      score2Id: string, 
      winScoreId: string, 
      router: Router, 
      gameState: GameState, 
      user: User, 
      gameMode: 'pvp' | 'ai' = 'ai', 
      aiDifficulty: 'easy' | 'medium' | 'hard' | 'boris' = 'medium',
      star1: boolean = false,
      star2: boolean = false,
      star3: boolean = false) {
    super();
    this.ids = { canvas: canvasId, score1: score1Id, score2: score2Id, winScore: winScoreId };
    this.router = router;
    this.gameState = gameState;
    this.user = user;
    this.gameMode = gameMode;
    this.aiDifficulty = aiDifficulty;
    this.aiController = new AIController(aiDifficulty);
    this.star1 = star1;
    this.star2 = star2;
    this.star3 = star3;

    const freqInput = document.getElementById("powerupFreq") as HTMLInputElement;
    if (freqInput) {
        this.powerupFrequency = parseInt(freqInput.value);
    }
    (window as any).quitGame = () => this.quitGame();
  }
  
  public setCtx() {
    this.canvas = document.getElementById(this.ids.canvas) as HTMLCanvasElement;
    
    this.renderer = new PongRenderer(this.canvas);
    this.physics = new PongPhysics(this.canvas.width, this.canvas.height);

    this.scoreElements = {
      winScore: document.getElementById(this.ids.winScore)!,
      p1: document.getElementById(this.ids.score1)!,
      p2: document.getElementById(this.ids.score2)!
    };
    this.scoreElements.winScore.innerHTML = this.winningScore.toString();
    
    
    
    this.paddle1 = { x: 10, y: this.canvas.height / 2 - this.paddleHeight / 2, width: this.paddleWidth, height: this.paddleHeight, dy: 0, speed: this.paddleSpeed, hits: 0 };
    this.paddle2 = { x: this.canvas.width - this.paddleWidth - 10, y: this.canvas.height / 2 - this.paddleHeight / 2, width: this.paddleWidth, height: this.paddleHeight, dy: 0, speed: this.paddleSpeed, hits: 0 };
    this.ball = { x: this.canvas.width / 2, y: this.canvas.height / 2, radius: 7, speed: this.initialBallSpeed, dx: 0, dy: 0 , lastHitter : 0};
    
    this.collectibles = [];
    this.lastCollectibleSpawn = Date.now();

    if (!this.isTournamentMatch) {
        this.player1Name = this.user.getUsername() == undefined ? "Player 1" : this.user.getUsername();
        // this.player1Name = "Player 1";
        this.player2Name = (this.gameMode === 'ai') ? "AI" : "Player 2";
    }

    this.generateLegend();

    this.updateNameDisplay();
    this.resetRound(true);
    
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  private quitGame() {
      this.stop(); 
      this.router.navigate('/games', this.gameState, this.user);
  }

  public setPlayerNames(p1: string, p2: string) {
    this.player1Name = p1;
    this.player2Name = p2;
    this.gameMode = 'pvp'; 
    this.isTournamentMatch = true;
    this.updateNameDisplay();
  }

  private updateNameDisplay() {
    const p1Span = document.getElementById('p1-name');
    const p2Span = document.getElementById('p2-name');
    if (p1Span) p1Span.innerText = this.player1Name + ": ";
    if (p2Span) p2Span.innerText = this.player2Name + ": ";
  }

  private generateLegend() {
    const legendContainer = document.getElementById('powerup-legend');
    if (!legendContainer) return;

    legendContainer.innerHTML = '';
    legendContainer.style.display = 'none';

    if (!this.star1 && !this.star2 && !this.star3) return;

    legendContainer.style.display = 'flex';
    let html = '<div class="legend-title">Power-Ups</div>';

    const createRow = (text: string, fill: string, stroke: string) => {
        return `
        <div class="legend-item">
            <div class="legend-bubble" style="background-color: ${fill}; border-color: ${stroke};"></div>
            <span>${text}</span>
        </div>`;
    };

    if (this.star1) {
        html += createRow("Bigger Ball", "#FFFF00", "#0000FF");
        html += createRow("Smaller Ball", "#FFFF00", "#FF0000");
    }

    if (this.star2) {
        html += createRow("Bigger Paddle", "#00FFFF", "#0000FF");
        html += createRow("Smaller Paddle", "#00FFFF", "#FF0000");
    }

    if (this.star3) {
        html += createRow("Change Direction", "#FF00FF", "#FFFF00");
        html += createRow("Faster Game", "#888888", "#FFFF00");
    }

    legendContainer.innerHTML = html;
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

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      this.animationFrameId = null;
      console.log('Game Stopped');
    }
  }

  private gameLoop() {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  private update() {
    if (this.isPaused || this.isGameOver || !this.physics) return;

    if (this.star1 || this.star2 || this.star3){
      const now = Date.now();
      if (now - this.lastCollectibleSpawn > (this.powerupFrequency * 1000)) {
          this.spawnCollectible();
          this.lastCollectibleSpawn = now;
      }
    }

    const p1Up = !!(this.keysPressed['w'] || this.keysPressed['z']);
    const p1Down = !!this.keysPressed['s'];
    
    this.physics.movePaddle(this.paddle1!, p1Up, p1Down);
    
    if (this.gameMode === 'ai') {
        const aiInput = { 
            ball: this.ball!, 
            paddle: this.paddle2!, 
            opponentPaddle: this.paddle1!, 
            canvasHeight: this.canvas!.height 
        };
        const aiDecision = this.aiController.update(aiInput);
        this.keysPressed['ArrowUp'] = aiDecision.up;
        this.keysPressed['ArrowDown'] = aiDecision.down;
    }
    
    const p2Up = !!this.keysPressed['ArrowUp'];
    const p2Down = !!this.keysPressed['ArrowDown'];
    
    this.physics.movePaddle(this.paddle2!, p2Up, p2Down);

    if (this.star1 || this.star2 || this.star3){
      this.physics.updateCollectibles(this.collectibles);
      this.collectibles = this.collectibles.filter(c => c.active);
      const hitId = this.physics.checkCollectibleCollision(this.ball!, this.collectibles);
      if (hitId !== -1) {
          const bubble = this.collectibles.find(c => c.id === hitId);
          if (bubble) {
              console.log("Applied Effect:", bubble.type);
              this.applyPowerUp(bubble.type);
          }
          this.collectibles = this.collectibles.filter(c => c.id !== hitId);
      }
    }

    const hitsBefore = this.paddle1!.hits + this.paddle2!.hits;
    const result = this.physics.update(this.ball!, this.paddle1!, this.paddle2!);
    const hitsAfter = this.paddle1!.hits + this.paddle2!.hits;
    if (hitsAfter > hitsBefore) {
        this.currentRallyHits++;
    }
    if (result === 1) {
        this.score1++;
        this.handleScore();
    } else if (result === 2) {
        this.score2++;
        this.handleScore();
    }
  }

  private applyPowerUp(type: string) {
    if (this.ball!.lastHitter === 0) return;

    const targetPaddle = (this.ball!.lastHitter === 1) ? this.paddle1 : this.paddle2;
    if (!targetPaddle) return;

    switch (type) {
        case 'IncreaseBallSize':
            this.ball!.radius = Math.min(this.ball!.radius + 5, 30);
            break;
        case 'DecreaseBallSize':
            this.ball!.radius = Math.max(this.ball!.radius - 2, 5);
            break;
        case 'IncreasePaddleSize':
            targetPaddle.height = Math.min(targetPaddle.height + 30, 200);
            break;
        case 'DecreasePaddleSize':
            targetPaddle.height = Math.max(targetPaddle.height - 30, 30);
            break;
        case 'ChangeBallDirection':
            this.ball!.dy *= -1;
            break;
        case 'IncreaseGameSpeed':
            targetPaddle.speed = Math.max(targetPaddle.speed + 1, 10);
            this.physics?.increaseBallSpeed(this.ball!, 16);
            break;
    }
  }

  private spawnCollectible() {
    if (!this.canvas) return;

    const availableTypes: string[] = [];

    if (this.star1) {
        availableTypes.push('IncreaseBallSize', 'DecreaseBallSize');
    }

    if (this.star2) {
        availableTypes.push('IncreasePaddleSize', 'DecreasePaddleSize');
    }

    if (this.star3) {
        availableTypes.push('ChangeBallDirection', 'IncreaseGameSpeed');
    }

    if (availableTypes.length === 0) return;


    const randomIndex = Math.floor(Math.random() * availableTypes.length);
    const selectedType = availableTypes[randomIndex]!;


    const radius = 15;
    const safeZoneX = this.canvas.width * 0.2; 
    const randomX = safeZoneX + (Math.random() * (this.canvas.width - (safeZoneX * 2)));
    
    const minY = radius;
    const maxY = this.canvas.height - radius;
    const randomY = minY + (Math.random() * (maxY - minY));


    const newBubble: Collectible = {
        id: this.nextCollectibleId++,
        x: randomX,
        y: randomY,
        radius: radius,
        dy: (Math.random() < 0.5 ? 1 : -1) * 1.5,
        active: true,
        type: selectedType
    };

    this.collectibles.push(newBubble);
  }

  private draw() {
    if (!this.renderer) return;

    this.renderer.draw(this.paddle1!, this.paddle2!, this.ball!, this.collectibles);

    if (this.isPaused && !this.isGameOver) {
        this.renderer.drawPaused();
    }

    if (this.isGameOver) {
        const winner = this.score1 >= this.winningScore ? this.player1Name! : this.player2Name!;
        this.renderer.drawGameOver(winner, this.isTournamentMatch);
    }
  }

  private handleScore() {
    this.updateScoresUI();
    this.resetRound();
  }

  private resetRound(firstServe: boolean = false) {
    this.longestRally = Math.max(this.longestRally, this.currentRallyHits);
    this.currentRallyHits = 0;
    
    this.ball!.x = this.canvas!.width / 2;
    this.ball!.y = this.canvas!.height / 2;
    this.ball!.speed = this.initialBallSpeed;
    
    this.ball!.radius = 7;
    this.ball!.lastHitter = 0;
    if (this.paddle1) {
      this.paddle1.speed = this.paddleSpeed;
      this.paddle1.height = this.paddleHeight;
      this.paddle1.y = this.canvas!.height / 2 - this.paddleHeight / 2;
    }
    if (this.paddle2) {
      this.paddle2.speed = this.paddleSpeed;
      this.paddle2.height = this.paddleHeight;
      this.paddle2.y = this.canvas!.height / 2 - this.paddleHeight / 2;
    }

    this.collectibles = [];
    this.lastCollectibleSpawn = Date.now();

    const currentDirectionX = Math.sign(this.ball!.dx);
    let directionX = firstServe ? (Math.random() < 0.5 ? 1 : -1) : currentDirectionX * -1;
    const angle = (Math.random() * Math.PI / 4) - (Math.PI / 8);
    this.ball!.dx = directionX * this.ball!.speed * Math.cos(angle);
    this.ball!.dy = this.ball!.speed * Math.sin(angle);
  }

  private updateScoresUI() {
    this.longestRally = Math.max(this.longestRally, this.currentRallyHits);
    
    this.scoreElements!.p1.innerText = this.score1.toString();
    this.scoreElements!.p2.innerText = this.score2.toString();

    if (!this.isGameOver && (this.score1 >= this.winningScore || this.score2 >= this.winningScore)) {
      this.isGameOver = true;
      if (this.isTournamentMatch && this.gameState.currentTournament) {
        const winnerName = this.score1 >= this.winningScore ? this.player1Name! : this.player2Name!;
        this.gameState.currentTournament.reportMatchWinner(winnerName);
      }
      this.showEndGameDashboard();
    }
  }

  private showEndGameDashboard() {
    const dashboard = document.getElementById('game-over-dashboard');
    if (!dashboard) return;

    const matchDurationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(matchDurationSeconds / 60);
    const seconds = matchDurationSeconds % 60;

    const winnerName = this.score1 > this.score2 ? this.player1Name : this.player2Name;
    const winnerDisplay = document.getElementById('winner-display');
    if (winnerDisplay) winnerDisplay.innerText = `${winnerName} Wins!`;

    document.getElementById('stat-duration')!.innerText = `${minutes}m ${seconds}s`;
    
    document.getElementById('p1-stat-name')!.innerText = `${this.player1Name} Hits:`;
    document.getElementById('stat-p1-hits')!.innerText = this.paddle1!.hits.toString();

    document.getElementById('p2-stat-name')!.innerText = `${this.player2Name} Hits:`;
    document.getElementById('stat-p2-hits')!.innerText = this.paddle2!.hits.toString();
    
    document.getElementById('stat-rally')!.innerText = this.longestRally.toString();

    const restartMsg = document.getElementById('restart-msg');
    if (restartMsg) {
        const baseMsg = this.isTournamentMatch ? "Press 'Space' to Continue" : "Press 'Space' to Restart";
        const escMsg = this.isTournamentMatch ? "" : " or 'Esc' to Quit";
        restartMsg.innerText = baseMsg + escMsg;
    }

    dashboard.style.display = 'block';
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.isGameOver) {
        if (e.key === ' ') {
            this.restart();
            return;
        }
        if (e.key === 'Escape' && !this.isTournamentMatch) {
            this.router.navigate('/games', this.gameState, this.user);
            return;
        }
    }
    if (e.key === 'Escape' && !this.isGameOver) {
      this.isPaused = !this.isPaused;
    }
    this.keysPressed[e.key] = true;
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.keysPressed[e.key] = false;
  }

  private restart() {
    if (this.isTournamentMatch) {
      if (this.gameState.currentTournament) {
        this.gameState.currentTournament.currentMatch = null; 
      }
      this.router.navigate('/tournament-bracket', this.gameState, this.user);
      return;
    }

    this.score1 = 0;
    this.score2 = 0;
    this.updateScoresUI();

    const paddleHeight = 100;
    this.paddle1!.y = this.canvas!.height / 2 - paddleHeight / 2;
    this.paddle1!.hits = 0;
    this.paddle2!.y = this.canvas!.height / 2 - paddleHeight / 2;
    this.paddle2!.hits = 0;

    this.isGameOver = false;
    this.isPaused = false;
    this.startTime = Date.now();
    this.longestRally = 0;
    this.currentRallyHits = 0;
    
    const dashboard = document.getElementById('game-over-dashboard');
    if (dashboard) dashboard.style.display = 'none';

    this.resetRound(true);
  }

  public setWinningScore(newWinningScore: number) {
    this.winningScore = newWinningScore;
    if (this.scoreElements) {
      this.scoreElements.winScore.innerHTML = this.winningScore.toString();
    }
  }
}