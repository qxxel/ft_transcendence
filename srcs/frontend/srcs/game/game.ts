/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 16:05:30 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:12:56 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FILE THAT CONTAIN THE class	FOR THE PONGGAME (WITH ALL METHODS)


/* ====================== INTERFACES ====================== */

interface	Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	dy: number;
	speed: number;
	hits: number;
}

interface	Ball {
	x: number;
	y: number;
	radius: number;
	dx: number;
	dy: number;
	speed: number;
}


/* ====================== CLASS ====================== */

export class	PongGame {
	private	canvas: HTMLCanvasElement | null = null;
	private	ctx: CanvasRenderingContext2D | null = null;
	private	animationFrameId: number | null = null;

	private	isPaused: boolean = false;
	private	isGameOver: boolean = false;
	private	winningScore: number = 5;

	private	readonly initialBallSpeed: number = 5;
	private	readonly maxBallSpeed: number = 12;
	private	readonly ballSpeedIncrease: number = 0.5;

	private	gameMode: "pvp" | "ai";
	private	aiLastDecisionTime: number = 0;
	private	aiTargetY: number = 0;

	private	paddle1: Paddle | null = null;
	private	paddle2: Paddle | null = null;
	private	ball: Ball | null = null;

	private	score1: number = 0;
	private	score2: number = 0;
	private	scoreElements: { winScore: HTMLElement; p1: HTMLElement; p2: HTMLElement } | null = null;

	private	startTime: number = 0;
	private	longestRally: number = 0;
	private	currentRallyHits: number = 0;

	private	ids: { canvas: string; score1: string; score2: string; winScore: string };
	private	keysPressed: { [key: string]: boolean } = {};

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
		this.gameMode = gameMode;
	}
	
	public	setCtx(): void {
		this.canvas! = document.getElementById(this.ids.canvas) as HTMLCanvasElement;
		this.ctx = this.canvas!.getContext('2d');
		this.scoreElements! = {
			winScore: document.getElementById(this.ids.winScore)!,
			p1: document.getElementById(this.ids.score1)!,
			p2: document.getElementById(this.ids.score2)!
		};

		this.scoreElements.winScore.innerHTML = this.winningScore.toString();
		
		const	paddleWidth: number = 10;
		const	paddleHeight: number = 100;
		const	paddleSpeed: number = 6;
		
		this.paddle1! = {
			x: 10,
			y: this.canvas!.height / 2 - paddleHeight / 2,
			width: paddleWidth,
			height: paddleHeight,
			dy: 0,
			speed: paddleSpeed,
			hits: 0,
		};
		
		this.paddle2! = {
			x: this.canvas!.width - paddleWidth - 10,
			y: this.canvas!.height / 2 - paddleHeight / 2,
			width: paddleWidth,
			height: paddleHeight,
			dy: 0,
			speed: paddleSpeed,
			hits: 0,
		};
		
		this.ball! = {
			x: this.canvas!.width / 2,
			y: this.canvas!.height / 2,
			radius: 7,
			speed: this.initialBallSpeed,
			dx: 0,
			dy: 0,
		};
		
		this.aiTargetY = this.canvas!.height / 2;

		this.resetBall(true);
		
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}
	
	/* Main game loop that runs at ~60 FPS - updates game state and renders graphics */
	private	gameLoop(): void {
		this.update();
		this.draw();
		this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
	}

	private	update(): void {
		if (this.isPaused || this.isGameOver) {
			return;
		}
		this.movePaddle1();
		if (this.gameMode === 'ai') {
			this.moveAI();
		}
		this.movePaddle2();
		this.moveBall();
	}

	private	draw(): void {
		this.ctx!.fillStyle = '#000';
		this.ctx!.fillRect(0, 0, this.canvas!!.width, this.canvas!!.height);

		this.ctx!.fillStyle = '#fff';
		this.ctx!.fillRect(this.paddle1!!.x, this.paddle1!!.y, this.paddle1!!.width, this.paddle1!!.height);
		this.ctx!.fillRect(this.paddle2!!.x, this.paddle2!!.y, this.paddle2!!.width, this.paddle2!!.height);
		this.ctx!.beginPath();
		this.ctx!.arc(this.ball!!.x, this.ball!!.y, this.ball!!.radius, 0, Math.PI * 2);
		this.ctx!.fill();

		this.ctx!.strokeStyle = '#fff';
		this.ctx!.setLineDash([10, 10]);
		this.ctx!.beginPath();
		this.ctx!.moveTo(this.canvas!.width / 2, 0);
		this.ctx!.lineTo(this.canvas!.width / 2, this.canvas!.height);
		this.ctx!.stroke();

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

		 const	winner: "Player 1" | "Player 2" = this.score1 >= this.winningScore ? "Player 1" : "Player 2";
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

	private	movePaddle1(): void {
		if ((this.keysPressed['w'] || this.keysPressed['z']) && this.paddle1!.y > 0) {
			this.paddle1!.y -= this.paddle1!.speed;
		}
		if (this.keysPressed['s'] && this.paddle1!.y < this.canvas!.height - this.paddle1!.height) {
			this.paddle1!.y += this.paddle1!.speed;
		}
	}

	private	movePaddle2(): void {
		if (this.keysPressed['ArrowUp'] && this.paddle2!.y > 0) {
			this.paddle2!.y -= this.paddle2!.speed;
		}
		if (this.keysPressed['ArrowDown'] && this.paddle2!.y < this.canvas!.height - this.paddle2!.height) {
			this.paddle2!.y += this.paddle2!.speed;
		}
	}

	private	moveBall(): void {
		const	prevBallX: number = this.ball!.x - this.ball!.dx;
		this.ball!.x += this.ball!.dx;
		this.ball!.y += this.ball!.dy;

		if (this.ball!.y + this.ball!.radius > this.canvas!.height || this.ball!.y - this.ball!.radius < 0) {
			this.ball!.dy *= -1;
		}

		if (this.ball!.dx < 0 && this.ball!.x - this.ball!.radius <= this.paddle1!.x + this.paddle1!.width && prevBallX - this.ball!.radius >= this.paddle1!.x + this.paddle1!.width && this.ball!.y > this.paddle1!.y && this.ball!.y < this.paddle1!.y + this.paddle1!.height) {
			this.calculateDeflection(this.paddle1!);
			this.increaseBallSpeed();
		}

		if (this.ball!.dx > 0 && this.ball!.x + this.ball!.radius >= this.paddle2!.x && prevBallX + this.ball!.radius <= this.paddle2!.x && this.ball!.y > this.paddle2!.y && this.ball!.y < this.paddle2!.y + this.paddle2!.height) {
			this.calculateDeflection(this.paddle2!);
			this.increaseBallSpeed();
		}

		if (this.ball!.x + this.ball!.radius < 0) {
			this.score2++;
			this.updateScores();
			this.resetBall();
		} else if (this.ball!.x - this.ball!.radius > this.canvas!.width) {
			this.score1++;
			this.updateScores();
			this.resetBall();
		}
	}

	private	calculateDeflection(paddle: Paddle): void {
		const	relativeIntersectY: number = (paddle.y + (paddle.height / 2)) - this.ball!.y;
		const	normalizedIntersectY: number = relativeIntersectY / (paddle.height / 2);
		const	maxBounceAngle: number = Math.PI / 3; // 60 degrees
		const	bounceAngle: number = normalizedIntersectY * maxBounceAngle;
		const	direction: number = (this.ball!.x < this.canvas!.width / 2) ? 1 : -1;
		this.ball!.dx = direction * this.ball!.speed * Math.cos(bounceAngle);
		this.ball!.dy = -1 * this.ball!.speed * Math.sin(bounceAngle);
		paddle.hits++;
		this.currentRallyHits++;
	}

	private	increaseBallSpeed(): void {
		if (this.ball!.speed >= this.maxBallSpeed) return;
		const	newSpeed: number = Math.min(this.ball!.speed + this.ballSpeedIncrease, this.maxBallSpeed);
		const	magnitude: number = Math.sqrt(this.ball!.dx ** 2 + this.ball!.dy ** 2);
		if (magnitude > 0) {
			this.ball!.dx = (this.ball!.dx / magnitude) * newSpeed;
			this.ball!.dy = (this.ball!.dy / magnitude) * newSpeed;
			this.ball!.speed = newSpeed;
		}
	}

	private	resetBall(firstServe: boolean = false): void {
		console.log('ball reseted');
		this.longestRally = Math.max(this.longestRally, this.currentRallyHits);
		this.currentRallyHits = 0;
		this.ball!.x = this.canvas!.width / 2;
		this.ball!.y = this.canvas!.height / 2;
		this.ball!.speed = this.initialBallSpeed;
		const	currentDirectionX: number = Math.sign(this.ball!.dx);
		let	directionX = firstServe ? (Math.random() < 0.5 ? 1 : -1) : currentDirectionX * -1;
		const	angle: number = (Math.random() * Math.PI / 4) - (Math.PI / 8);
		this.ball!.dx = directionX * this.ball!.speed * Math.cos(angle);
		this.ball!.dy = this.ball!.speed * Math.sin(angle);
	}

	private	updateScores(): void {
		this.scoreElements!.p1.innerText = this.score1.toString();
		this.scoreElements!.p2.innerText = this.score2.toString();
		if (!this.isGameOver && (this.score1 >= this.winningScore || this.score2 >= this.winningScore)) {
			this.isGameOver = true;
			this.showEndGameDashboard();
		}
	}

	private	showEndGameDashboard(): void {
		const	dashboard: HTMLElement | null = document.getElementById('game-over-dashboard');
		if (!dashboard)
			return;

		const	matchDurationSeconds: number = Math.floor((Date.now() - this.startTime) / 1000);
		const	minutes: number = Math.floor(matchDurationSeconds / 60);
		const	seconds: number = matchDurationSeconds % 60;

		document.getElementById('stat-winner')!.innerText = this.score1 > this.score2 ? 'Player 1' : 'Player 2';
		document.getElementById('stat-duration')!.innerText = `${minutes}m ${seconds}s`;
		document.getElementById('stat-p1-hits')!.innerText = this.paddle1!.hits.toString();
		document.getElementById('stat-p2-hits')!.innerText = this.paddle2!.hits.toString();
		document.getElementById('stat-rally')!.innerText = this.longestRally.toString();
		dashboard.style.display = 'block';
	}

	private	handleKeyDown(e: KeyboardEvent): void {
		if (this.isGameOver && e.key === ' ') {
			this.restart();
			return ;
		}

		if (e.key === 'Escape' && !this.isGameOver) {
			this.isPaused = !this.isPaused;
		}

		this.keysPressed[e.key] = true;
	}

	private	handleKeyUp(e: KeyboardEvent): void {
		this.keysPressed[e.key] = false;
	}

	public	start(): void {
		if (!this.animationFrameId) {
			this.startTime = Date.now();
			window.addEventListener('keydown', this.handleKeyDown);
			window.addEventListener('keyup', this.handleKeyUp);
			this.gameLoop();
			console.log('Game Started');
		}
	}

	private	restart(): void {
		this.score1 = 0;
		this.score2 = 0;
		this.updateScores();

		this.paddle1!.y = this.canvas!.height / 2 - this.paddle1!.height / 2;
		this.paddle1!.hits = 0;
		this.paddle2!.y = this.canvas!.height / 2 - this.paddle2!.height / 2;
		this.paddle2!.hits = 0;

		this.isGameOver = false;
		this.isPaused = false;

		this.startTime = Date.now();
		this.longestRally = 0;
		this.currentRallyHits = 0;
		
		const	dashboard: HTMLElement | null = document.getElementById('game-over-dashboard');
		if (dashboard)
				dashboard.style.display = 'none';

		this.resetBall(true);
	}

	public	stop(): void {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			window.removeEventListener('keydown', this.handleKeyDown);
			window.removeEventListener('keyup', this.handleKeyUp);
			this.animationFrameId = null;
			console.log('Game Stopped');
		}
	}

	private	moveAI(): void {
		const	now: number = Date.now();
		if (now - this.aiLastDecisionTime > 1000) {
			this.aiLastDecisionTime = now;
			
			if (this.ball!.dx > 0) { 
				const	timeToImpact = (this.paddle2!.x - this.ball!.x) / this.ball!.dx;
				let	predictedY = this.ball!.y + (this.ball!.dy * timeToImpact);

				// Upgrade ici : actuellement la prediction ne compte pas les rebonds sur les murs 
				predictedY = Math.max(this.ball!.radius, Math.min(predictedY, this.canvas!.height - this.ball!.radius));
				
				this.aiTargetY = predictedY;
			} else {
				this.aiTargetY = this.canvas!.height / 2;
			}
		}

		const	paddleCenter: number = this.paddle2!.y + this.paddle2!.height / 2;
		
		if (paddleCenter < this.aiTargetY - 10) {
			this.keysPressed['ArrowDown'] = true;
			this.keysPressed['ArrowUp'] = false;
		} else if (paddleCenter > this.aiTargetY + 10) {
			this.keysPressed['ArrowDown'] = false; 
			this.keysPressed['ArrowUp'] = true;
		} else {
			this.keysPressed['ArrowDown'] = false;
			this.keysPressed['ArrowUp'] = false;
		}
	}

	public	setWinningScore(newWinningScore: number): void {
		this.winningScore = newWinningScore;
	}
}
