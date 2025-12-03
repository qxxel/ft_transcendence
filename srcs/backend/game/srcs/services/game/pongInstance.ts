/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongInstance.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 23:56:07 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/01 16:42:35 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT CONTAIN THE CLASS THAT HANDLE THE GAME LOOP


/* ====================== IMPORTS ====================== */

import { Server }			from 'socket.io';
import { PongPhysics }		from "../../engine/pong/pongPhysic.js"
import { AIController }		from "../../engine/pong/pongAi.js"
import { PongService }		from "../pongService.js"
import type { GameOptions, Collectible, GameState, Paddle, PowerUps }	from "../../engine/pong/gameState.js"
import { pongAddDto } from '../../dtos/pongAddDto.js';


/* ====================== CLASS ====================== */

export class	PongInstance {
	public	gameState: GameState;
	
	private	io: Server;
	private	roomId: string;
	private	pService: PongService;

	// ENGINES
	private	physics: PongPhysics;
	private	ai?: AIController;

	// LOOP GESTION
	private	gameLoopInterval: NodeJS.Timeout | null = null;
	private	isGameFinished: boolean = false;
	private	readonly WINNING_SCORE = 5;

	// INPUTS GESTIONS
	private	keyState = {
		p1: { up: false, down: false },
		p2: { up: false, down: false }
	};
	
	// POWER UPS
	private	powerUpsActive: PowerUps; 
	private	powerUpFrequency: number;

	private	lastCollectibleSpawn: number = 0;
	private	nextCollectibleId: number = 0;


	constructor(io: Server, roomId: string, pService: PongService, opts: GameOptions) {
		this.io = io;
		this.roomId = roomId;
		this.pService = pService;

		const width = 800;
		const height = 600;

		this.powerUpsActive = opts.activePowerUps || { star1: false, star2: false, star3: false };
		this.powerUpFrequency = opts.powerUpFreq;

		this.physics = new PongPhysics(width, height);
		
		if (opts.mode === 'ai') {
			this.ai = new AIController(opts.difficulty);
		}

		this.gameState = {
			width: width,
			height: height,
			score1: 0,
			score2: 0,
			status: 'playing',
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
				speed:
				6,
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
		if (this.isGameFinished || this.gameState.status !== 'playing') return;

		if (this.ai) {
			const aiMove = this.ai.update(this.gameState);
			this.keyState.p2.up = aiMove.up;
			this.keyState.p2.down = aiMove.down;
		}

		const p1Dir = this.resolveDirection(this.keyState.p1);
		const p2Dir = this.resolveDirection(this.keyState.p2);

		this.physics.movePaddle(this.gameState.paddle1, this.gameState.ball, p1Dir);
		this.physics.movePaddle(this.gameState.paddle2, this.gameState.ball, p2Dir);

		this.handleCollectiblesSpawn();

		this.physics.updateCollectibles(this.gameState.collectibles);
		this.gameState.collectibles = this.gameState.collectibles.filter(c => c.active);

		const hitCollectibleId = this.physics.checkCollectibleCollision(this.gameState.ball, this.gameState.collectibles);
		if (hitCollectibleId !== -1) {
			const collected = this.gameState.collectibles.find(c => c.id === hitCollectibleId);
			if (collected) {
				this.applyPowerUp(collected.type);
			}
			this.gameState.collectibles = this.gameState.collectibles.filter(c => c.id !== hitCollectibleId);
		}

		const scoreResult = this.physics.update(this.gameState.ball, this.gameState.paddle1, this.gameState.paddle2);
		
		if (scoreResult === 1) {
			this.gameState.score1++;
			this.resetRound();
			this.checkWinCondition();
		} else if (scoreResult === 2) {
			this.gameState.score2++;
			this.resetRound();
			this.checkWinCondition();
		}

console.log("📤 Envoi update", this.gameState.ball.x);
		this.io.to(this.roomId).volatile.emit('game-update', this.gameState);
	}

	// --- GESTION INPUTS (Appelé par le socket) ---
	public handleInput(player: 1 | 2, key: string, isPressed: boolean) {
		const keys = player === 1 ? this.keyState.p1 : this.keyState.p2;

		if (key === 'ArrowUp' || key === 'w' || key === 'z') keys.up = isPressed;
		if (key === 'ArrowDown' || key === 's') keys.down = isPressed;
	}

	private resolveDirection(keys: { up: boolean, down: boolean }): 'up' | 'down' | 'none' {
		if (keys.up && keys.down) return 'none'; // Annulation
		if (keys.up) return 'up';
		if (keys.down) return 'down';
		return 'none';
	}

	// --- LOGIQUE JEU ---

	private resetRound(firstServe: boolean = false) {
		const width = this.gameState.width;
		const height = this.gameState.height;

		this.gameState.ball.x = width / 2;
		this.gameState.ball.y = height / 2;
		this.gameState.ball.speed = 5; // Vitesse initiale
		this.gameState.ball.radius = 7;
		this.gameState.ball.lastHitter = 0;

		// Reset paddles (Optionnel, selon tes règles)
		this.gameState.paddle1.y = height / 2 - this.gameState.paddle1.height / 2;
		this.gameState.paddle2.y = height / 2 - this.gameState.paddle2.height / 2;
		
		// Reset direction random
		const currentDirectionX = Math.sign(this.gameState.ball.dx);
		let directionX = firstServe ? (Math.random() < 0.5 ? 1 : -1) : currentDirectionX * -1;
		const angle = (Math.random() * Math.PI / 4) - (Math.PI / 8);
		
		this.gameState.ball.dx = directionX * this.gameState.ball.speed * Math.cos(angle);
		this.gameState.ball.dy = this.gameState.ball.speed * Math.sin(angle);
	}

	private async checkWinCondition() {
		if (this.gameState.score1 >= this.WINNING_SCORE || this.gameState.score2 >= this.WINNING_SCORE) {
			this.isGameFinished = true;
			this.gameState.status = 'finished';
			
			if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

			// Notifier la fin
			const winner = this.gameState.score1 >= this.WINNING_SCORE ? 1 : 2;
			this.io.to(this.roomId).emit('game-over', { 
				winner: winner,
				score1: this.gameState.score1,
				score2: this.gameState.score2
			});

			// Sauvegarde DB
			console.log("Fin de partie. Sauvegarde en cours...");
			try {
				// const	pongGame: pongAddDto = new pongAddDto();
				// this.pService.addPongGame(pongGame)
			} catch (e) {
				console.error("Error while saving the match:", e);
			}
		}
	}

	// --- POWER UPS ---

	private handleCollectiblesSpawn() {
		if (!this.powerUpFrequency)
			return ;
		
		const now = Date.now();
		if (now - this.lastCollectibleSpawn > this.powerUpFrequency) {
			this.spawnCollectible();
			this.lastCollectibleSpawn = now;
		}
	}

	private spawnCollectible() {
		const availableTypes: string[] = [];
		if (this.powerUpsActive.star1) availableTypes.push('IncreaseBallSize', 'DecreaseBallSize');
		if (this.powerUpsActive.star2) availableTypes.push('IncreasePaddleSize', 'DecreasePaddleSize');
		if (this.powerUpsActive.star3) availableTypes.push('ChangeBallDirection', 'IncreaseGameSpeed');

		if (availableTypes.length === 0) return;

		const type = availableTypes[Math.floor(Math.random() * availableTypes.length)]!;
		const radius = 15;
		// Zone sûre (milieu du terrain)
		const safeZoneX = this.gameState.width * 0.2;
		const x = safeZoneX + (Math.random() * (this.gameState.width - safeZoneX * 2));
		const y = radius + (Math.random() * (this.gameState.height - radius * 2));

		const newCollectible: Collectible = {
			id: this.nextCollectibleId++,
			x: x, y: y, radius: radius,
			dy: (Math.random() < 0.5 ? 1 : -1) * 1.5,
			active: true,
			type: type
		};
		this.gameState.collectibles.push(newCollectible);
	}

	private applyPowerUp(type: string) {
		if (this.gameState.ball.lastHitter === 0) return;

		const targetPaddle = (this.gameState.ball.lastHitter === 1) 
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
}