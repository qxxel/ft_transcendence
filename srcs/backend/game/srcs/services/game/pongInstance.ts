/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongInstance.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 23:56:07 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 00:10:35 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT CONTAIN THE CLASS THAT HANDLE THE GAME LOOP


/* ====================== IMPORTS ====================== */

import { Server }		from 'socket.io'
import { GamesService }	from "../gamesService.js"
import { gamesAddDto }	from "../../dtos/gamesAddDto.js"
import { AIController }	from "../../engine/pong/pongAi.js"
import { PongPhysics }	from "../../engine/pong/pongPhysic.js"

import type { PongOptions, Collectible, PongState, PowerUps, PongResume, Paddle }	from "../../engine/pong/pongState.js"


/* ====================== CLASS ====================== */

export class	PongInstance {
	public	gameState: PongState;
	
	private	io: Server;
	private	userId: number | undefined;
	private	roomId: string;
	private	pongService: GamesService;
	private	isTournament: boolean;

	private	physics: PongPhysics;
	private	ai?: AIController;

	private	gameLoopInterval: NodeJS.Timeout | null = null;
	private	isGameFinished: boolean = false;
	private	winningScore: number = 5;
	

	private	gameStart: number = Date.now();
	private	pauseStart: number = 0;
	private	pauseDuration: number = 0;

	private	longestRally: number = 0;

	private	keyState = {
		p1: { up: false, down: false },
		p2: { up: false, down: false }
	};

	private	powerUpsActive: PowerUps; 
	private	powerUpFrequency: number;

	private	lastCollectibleSpawn: number = 0;
	private	nextCollectibleId: number = 0;

	private	p1name: string;
	private	p2name: string | undefined;

	constructor(io: Server, roomId: string, pongService: GamesService, userId: number | undefined, opts: PongOptions) {
		this.io = io;
		this.userId = userId;
		this.roomId = roomId;
		this.pongService = pongService;
		this.isTournament = opts.isTournament;

		const	width: number = 800;
		const	height: number = 600;

		this.winningScore = opts.winningScore;

		this.gameStart = Date.now();

		this.powerUpsActive = opts.activePowerUps || { star1: false, star2: false, star3: false };
		this.powerUpFrequency = opts.powerUpFreq;

		this.physics = new PongPhysics(width, height);

		if (opts.mode === 'ai')
			this.ai = new AIController(opts.difficulty);
		
		this.p1name = opts.p1name;
		this.p2name = opts.p2name;

		this.gameState = {
			width: width,
			height: height,
			score1: 0,
			score2: 0,
			status: "playing",
			collectibles: [],

			ball: { 
				x: width / 2,
				y: height / 2,
				radius: 7, 
				dx: 5,
				dy: 0,
				speed: 5,
				lastHitter: 0 
			},
			paddle1: { 
				x: 10,
				y: height / 2 - 50,
				width: 10,
				height: 100, 
				speed: 6,
				hits: 0 
			},
			paddle2: { 
				x: width - 20,
				y: height / 2 - 50,
				width: 10,
				height: 100, 
				speed: 6,
				hits: 0 
			}
		};

		this.resetRound(true);
	}

	public startGame() {
		console.log(`[PongInstance] Game started in room ${this.roomId}`);
		this.lastCollectibleSpawn = Date.now();

		this.gameLoopInterval = setInterval(() => {
			this.update();
		}, 1000 / 60);
	}

	private update() {
		if (this.isGameFinished || this.gameState.status !== "playing")
			return;

		if (this.ai) {
			const	aiMove = this.ai.update(this.gameState);
			this.keyState.p2.up = aiMove.up;
			this.keyState.p2.down = aiMove.down;
		}

		const	p1Dir: "up" | "down" | "none" = this.resolveDirection(this.keyState.p1);
		const	p2Dir: "up" | "down" | "none" = this.resolveDirection(this.keyState.p2);

		this.physics.movePaddle(this.gameState.paddle1, this.gameState.ball, p1Dir);
		this.physics.movePaddle(this.gameState.paddle2, this.gameState.ball, p2Dir);

		this.handleCollectiblesSpawn();

		this.physics.updateCollectibles(this.gameState.collectibles);
		this.gameState.collectibles = this.gameState.collectibles.filter(c => c.active);

		const	hitCollectibleId: number = this.physics.checkCollectibleCollision(this.gameState.ball, this.gameState.collectibles);
		if (hitCollectibleId !== -1) {
			const	collected = this.gameState.collectibles.find(c => c.id === hitCollectibleId);
			if (collected) {
				this.applyPowerUp(collected.type);
			}
			this.gameState.collectibles = this.gameState.collectibles.filter(c => c.id !== hitCollectibleId);
		}

		const	scoreResult: number = this.physics.update(this.gameState.ball, this.gameState.paddle1, this.gameState.paddle2);
		
		if (scoreResult === 1)
		{
			this.gameState.score1++;
			this.resetRound();
			this.checkWinCondition();
		}
		else if (scoreResult === 2)
		{
			this.gameState.score2++;
			this.resetRound();
			this.checkWinCondition();
		}

		this.io.to(this.roomId).volatile.emit('game-update', this.gameState);
	}

	public handleInput(player: 1 | 2, key: string, isPressed: boolean) {		
		if (player === 2 && this.ai)
			return ;

		const	keys = player === 1 ? this.keyState.p1 : this.keyState.p2;

		if (key === 'ArrowUp' || key === 'w' || key === 'z')
			keys.up = isPressed;

		if (key === 'ArrowDown' || key === 's')
			keys.down = isPressed;

		if (key === 'Escape' && this.gameState.status !== "finished" && isPressed)
		{
			console.log("escape");
			if (this.gameState.status === "playing")
			{
				this.gameState.status = "paused";
				this.pauseStart = Date.now();
			}
			else if (this.gameState.status === "paused")
			{
				this.gameState.status = "playing";
				this.pauseDuration += Date.now() - this.pauseStart;
				this.lastCollectibleSpawn += (Date.now() - this.pauseStart);
			}
			
			this.io.to(this.roomId).emit('game-update', this.gameState);
		}
	}

	private resolveDirection(keys: { up: boolean, down: boolean }): 'up' | 'down' | 'none' {
		if (keys.up && keys.down)
			return 'none';

		if (keys.up)
			return 'up';

		if (keys.down)
			return 'down';

		return 'none';
	}

	private resetRound(firstServe: boolean = false) {
		const	width: number = this.gameState.width;
		const	height: number = this.gameState.height;


		this.longestRally = 0;

		this.gameState.ball.x = width / 2;
		this.gameState.ball.y = height / 2;
		this.gameState.ball.speed = 5;
		this.gameState.ball.radius = 7;
		this.gameState.ball.lastHitter = 0;


		this.gameState.paddle1.width = 10;
		this.gameState.paddle1.height = 100;
		this.gameState.paddle1.speed = 6;
		this.gameState.paddle1.y = height / 2 - this.gameState.paddle1.height / 2;

		this.gameState.paddle2.width = 10;
		this.gameState.paddle2.height = 100;
		this.gameState.paddle2.speed = 6;
		this.gameState.paddle2.y = height / 2 - this.gameState.paddle2.height / 2;


		this.gameState.collectibles = [];


		const	currentDirectionX: number = Math.sign(this.gameState.ball.dx);
		let	directionX: number = firstServe ? (Math.random() < 0.5 ? 1 : -1) : currentDirectionX * -1;
		const	angle: number = (Math.random() * Math.PI / 4) - (Math.PI / 8);
		
		this.gameState.ball.dx = directionX * this.gameState.ball.speed * Math.cos(angle);
		this.gameState.ball.dy = this.gameState.ball.speed * Math.sin(angle);
	}

	private async checkWinCondition() {
		if (this.gameState.score1 >= this.winningScore || this.gameState.score2 >= this.winningScore) {
			this.isGameFinished = true;
			this.gameState.status = "finished";
			
			if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

			const	gameResume: PongResume = {
				winner: this.gameState.score1 >= this.winningScore ? 1 : 2,
				player1Hits: this.gameState.paddle1.hits,
				player2Hits: this.gameState.paddle2.hits,
				score1: this.gameState.score1,
				score2: this.gameState.score2,
				duration: Date.now() - this.gameStart - this.pauseDuration,
				longestRally: this.longestRally,
			}

			this.io.to(this.roomId).emit('game-over', gameResume);

			console.log("userId = " + this.userId);
			console.log("isTournament = " + this.isTournament);

			if (this.userId === undefined || this.isTournament)
				return ;

			console.log("here");
			try {
				const	gameDatabase = {
					idClient: this.userId,
					winner: gameResume.winner,
					gameType: 1,
					p1: this.p1name,
					p2: this.p2name,
					p1score: gameResume.score1,
					p2score: gameResume.score2,
					mode: this.ai ? "ai" : "pvp",
					powerup: this.powerUpFrequency ? true : false,
					start: this.gameStart,
					duration: gameResume.duration
				};

				const	pongGame: gamesAddDto = new gamesAddDto(gameDatabase);
				this.pongService.addGame(pongGame)
			} catch (e) {
				console.error("Error while saving the match:", e);
			}
		}
	}

	private handleCollectiblesSpawn() {
		if (!this.powerUpFrequency)
			return ;

		const	now = Date.now();
		if (now - this.lastCollectibleSpawn > this.powerUpFrequency) {
			this.spawnCollectible();
			this.lastCollectibleSpawn = now;
		}
	}

	private spawnCollectible() {
		const	availableTypes: string[] = [];
		if (this.powerUpsActive.star1) availableTypes.push('IncreaseBallSize', 'DecreaseBallSize');
		if (this.powerUpsActive.star2) availableTypes.push('IncreasePaddleSize', 'DecreasePaddleSize');
		if (this.powerUpsActive.star3) availableTypes.push('ChangeBallDirection', 'IncreaseGameSpeed');

		if (availableTypes.length === 0) return;

		const	type: string = availableTypes[Math.floor(Math.random() * availableTypes.length)]!;
		const	radius: number = 15;

		const	safeZoneX: number = this.gameState.width * 0.2;
		const	x: number = safeZoneX + (Math.random() * (this.gameState.width - safeZoneX * 2));
		const	y: number = radius + (Math.random() * (this.gameState.height - radius * 2));

		const	newCollectible: Collectible = {
			id: this.nextCollectibleId++,
			x: x, y: y, radius: radius,
			dy: (Math.random() < 0.5 ? 1 : -1) * 1.5,
			active: true,
			type: type
		};
		this.gameState.collectibles.push(newCollectible);
	}

	private applyPowerUp(type: string) {
		if (this.gameState.ball.lastHitter === 0)
			return;

		const	targetPaddle: Paddle = (this.gameState.ball.lastHitter === 1) 
			? this.gameState.paddle1 
			: this.gameState.paddle2;

		switch (type) {
			case 'IncreaseBallSize':
				this.gameState.ball.radius = Math.min(this.gameState.ball.radius + 5, 25);
				break;
			case 'DecreaseBallSize':
				this.gameState.ball.radius = Math.max(this.gameState.ball.radius - 3, 4);
				break;
			case 'IncreasePaddleSize':
				targetPaddle.height = Math.min(targetPaddle.height + 30, 200);
				break;
			case 'DecreasePaddleSize':
				targetPaddle.height = Math.max(targetPaddle.height - 30, 30);
				break;
			case 'ChangeBallDirection':
				this.gameState.ball.dy *= -1;
				break;
			case 'IncreaseGameSpeed':
				targetPaddle.speed = Math.max(targetPaddle.speed + 1, 10);
				this.physics.increaseBallSpeed(this.gameState.ball, 16);
				break;
		}
	}

	public	stopGame(): void {
		if (this.gameLoopInterval)
		{
			clearInterval(this.gameLoopInterval);
			this.gameLoopInterval = null;
		}

		this.gameState.status = 'finished';
		console.log(`[PongInstance] Game stopped manually for room ${this.roomId}`);
	}
}