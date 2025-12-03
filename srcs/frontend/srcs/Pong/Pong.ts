/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Pong.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:02:06 by kiparis           #+#    #+#             */
/*   Updated: 2025/12/01 16:32:48 by agerbaud         ###   ########.fr       */
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

import type { AppState } from "../index.js";
import { connectSocket, socket } from "../socket/socket.js";

/* ====================== GAME INTERFACES ====================== */

export interface	Ball {
	x: number;
	y: number;
	radius: number;
	dx: number;
	dy: number;
	speed: number;
	lastHitter: number;
}

export interface	Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	hits: number;
}

export interface	Collectible {
	id: number;
	x: number;
	y: number;
	radius: number;
	dy: number;
	active: boolean;
	type: string;
}

export interface	PongState {
	width: number;
	height: number;
	ball: Ball;
	paddle1: Paddle;
	paddle2: Paddle;
	collectibles: Collectible[];
	score1: number;
	score2: number;
	status: "playing" | "paused" | "finished";
}


/* ====================== OPTIONS INTERFACES ====================== */

export interface	PowerUps {
	star1: boolean;
	star2: boolean;
	star3: boolean;
}

export interface	GameOptions {
	width: number;
	height: number;
	mode: 'ai' | 'pvp';
	difficulty: "easy" | "medium" | "hard" | "boris";
	winningScore: number;
	powerUpFreq: number;
	activePowerUps: PowerUps;
}

/* ====================== CLASS ====================== */




export class PongGame extends Game {
	private canvas: HTMLCanvasElement | null = null;
	private animationFrameId: number | null = null;

	// RENDER SYSTEM
	private renderer: PongRenderer | null = null;

	// GAME STATE
	private serverState: PongState | null = null;
	private	isGameOver: boolean = false;

	// GAME DATA
	private player1Name: string = "Player 1";
	private player2Name: string = "Player 2";
	private scoreElements: { winScore: HTMLElement; p1: HTMLElement; p2: HTMLElement } | null = null;
	
	// UI IDS
	private ids: { canvas: string; score1: string; score2: string; winScore: string };
	
	// ROUTER AND USER
	private router: Router;
	private appState: AppState;
	private user: User;

	constructor(canvasId: string,
			score1Id: string,
			score2Id: string,
			winScoreId: string,
			router: Router,
			appState: AppState,
			user: User) {
		super();
		this.ids = { canvas: canvasId, score1: score1Id, score2: score2Id, winScore: winScoreId };
		this.router = router;
		this.appState = appState;
		this.user = user;

		(window as any).quitGame = () => this.quitGame();
	}
	
	// CALL WHEN `/pong` IS LOADED
	public setCtx() {
		this.canvas = document.getElementById(this.ids.canvas) as HTMLCanvasElement;
		this.renderer = new PongRenderer(this.canvas);

		this.scoreElements = {
			winScore: document.getElementById(this.ids.winScore)!,
			p1: document.getElementById(this.ids.score1)!,
			p2: document.getElementById(this.ids.score2)!
		};

		this.serverState = {
			width: this.canvas.width,
			height: this.canvas.height,
			ball: { x: this.canvas.width/2, y: this.canvas.height/2, radius: 7, dx:0, dy:0, speed:0, lastHitter:0 },
			paddle1: { x: 10, y: 250, width: 10, height: 100, speed:0, hits:0 },
			paddle2: { x: 780, y: 250, width: 10, height: 100, speed:0, hits:0 },
			collectibles: [],
			score1: 0, score2: 0,
			status: 'playing'
		};

		// 1. INIT PLAYERS NAMES
		if (this.appState.pendingOptions?.mode === 'ai') {
			this.player1Name = this.user.getUsername() || "Player 1";
			this.player2Name = "AI (" + this.appState.pendingOptions.difficulty + ")";
		} else {
			this.player1Name = "Player 1";
			this.player2Name = "Player 2";
		}
		this.updateNameDisplay();

		// 2. DISPLAY POWER UPS LEGENDS IF ACTIVE
		if (this.appState.pendingOptions) {
			this.scoreElements.winScore.innerText = this.appState.pendingOptions.winningScore.toString();
			this.generateLegend(this.appState.pendingOptions.activePowerUps);
		}

		// 3. SERVER CONNECTION
		this.connectToServer();

		// 4. BINDING INPUTS
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	private connectToServer() {
		// Connexion Socket si fermée
		if (!socket || !socket.connected) {
			connectSocket(); 
		}

		// Nettoyage des anciens écouteurs pour éviter les doublons
		socket.off('game-update');
		socket.off('game-over');

		// Écouter les mises à jour du serveur (60 fois/sec)
		socket.on('game-update', (newState: PongState) => {
			console.log("📦 Reçu un update !", newState.ball.x);
			this.serverState = newState;
			// On met à jour le score UI directement quand on reçoit l'info
			this.updateScoresUI();
		});

		// Écouter la fin de partie
		socket.on('game-over', (data: { winner: number }) => {
			this.showEndGameDashboard(data.winner);
		});

		// ENVOYER LE START AVEC LES OPTIONS
		if (this.appState.pendingOptions) {
			console.log("🚀 Envoi des options au serveur...", this.appState.pendingOptions);
			socket.emit('join-game', this.appState.pendingOptions);
			// On vide pour ne pas relancer par erreur
			this.appState.pendingOptions = undefined; 
		}
	}

	private quitGame() {
		this.stop(); 
		socket.emit('leave-game'); // Préviens le serveur
		this.router.navigate('/games', this.appState, this.user);
	}

	public start() {
		if (!this.animationFrameId) {
			window.addEventListener('keydown', this.handleKeyDown);
			window.addEventListener('keyup', this.handleKeyUp);
			this.renderLoop(); // On lance la boucle de DESSIN uniquement
			console.log('Client Render Loop Started');
		}
	}

	public stop() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			window.removeEventListener('keydown', this.handleKeyDown);
			window.removeEventListener('keyup', this.handleKeyUp);
			
			// On arrête d'écouter le socket
			socket.off('game-update');
			socket.off('game-over');
			
			this.animationFrameId = null;
		}
	}

	// Boucle d'affichage (interpolée par requestAnimationFrame)
	private renderLoop() {
		this.draw();
		this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
	}

	private draw() {
		if (!this.renderer || !this.serverState) return;

		// On délègue tout au renderer, en lui passant l'état reçu du serveur
		this.renderer.draw(
			this.serverState.paddle1, 
			this.serverState.paddle2, 
			this.serverState.ball, 
			this.serverState.collectibles
		);

		if (this.serverState.status === 'paused') {
			this.renderer.drawPaused();
		}
	}

	// --- INPUTS ---
	// On n'applique plus la logique ici, on envoie juste au serveur
	private handleKeyDown(e: KeyboardEvent) {
		if (e.repeat)
			return;

		if (this.isGameOver) {
			if (e.key === ' ') {
					this.router.navigate("/pong", this.appState, this.user)
					return;
			}
			// if (e.key === 'Escape' && !this.isTournamentMatch) {
			// 		this.router.navigate('/games', this.appState, this.user);
			// 		return;
			// }
		}

		// if (e.key === 'Escape' && !this.isGameOver) {
		// 	this.isPaused = !this.isPaused;
		// }

		// SENDING KEY AND PRESSED
		socket.emit('input', { key: e.key, pressed: true });
	}

	private handleKeyUp(e: KeyboardEvent) {
		// SENDING KEY AND UNPRESSED
		socket.emit('input', { key: e.key, pressed: false });
	}

	// --- UI HELPERS ---

	private updateScoresUI() {
		if (!this.scoreElements || !this.serverState) return;
		this.scoreElements.p1.innerText = this.serverState.score1.toString();
		this.scoreElements.p2.innerText = this.serverState.score2.toString();
	}

	private showEndGameDashboard(winnerId: number) {
		const dashboard = document.getElementById('game-over-dashboard');
		if (!dashboard)
			return;

		const winnerName = winnerId === 1 ? this.player1Name : this.player2Name;
		const winnerDisplay = document.getElementById('winner-display');
		if (winnerDisplay)
			winnerDisplay.innerText = `${winnerName} Wins!`;

		if (this.serverState)
		{
			document.getElementById('stat-p1-hits')!.innerText = this.serverState.paddle1.hits.toString();
			document.getElementById('stat-p2-hits')!.innerText = this.serverState.paddle2.hits.toString();
		}

		const	restartMsg = document.getElementById('restart-msg');
		if (restartMsg)
			restartMsg.innerText = "Press 'Space' to Restart or 'Esc' to Quit";

		dashboard.style.display = 'block';
	}

	private updateNameDisplay() {
		const p1Span = document.getElementById('p1-name');
		const p2Span = document.getElementById('p2-name');
		if (p1Span) p1Span.innerText = this.player1Name + ": ";
		if (p2Span) p2Span.innerText = this.player2Name + ": ";
	}

	private generateLegend(activePowerUps: PowerUps) {
		const legendContainer = document.getElementById('powerup-legend');
		if (!legendContainer) return;

		legendContainer.innerHTML = '';
		legendContainer.style.display = 'none';

		if (!activePowerUps.star1 && !activePowerUps.star2 && !activePowerUps.star3) return;

		legendContainer.style.display = 'flex';
		let html = '<div class="legend-title">Power-Ups</div>';

		const createRow = (text: string, fill: string, stroke: string) => {
				return `
				<div class="legend-item">
						<div class="legend-bubble" style="background-color: ${fill}; border-color: ${stroke};"></div>
						<span>${text}</span>
				</div>`;
		};

		if (activePowerUps.star1) {
				html += createRow("Bigger Ball", "#FFFF00", "#0000FF");
				html += createRow("Smaller Ball", "#FFFF00", "#FF0000");
		}

		if (activePowerUps.star2) {
				html += createRow("Bigger Paddle", "#00FFFF", "#0000FF");
				html += createRow("Smaller Paddle", "#00FFFF", "#FF0000");
		}

		if (activePowerUps.star3) {
				html += createRow("Change Direction", "#FF00FF", "#FFFF00");
				html += createRow("Faster Game", "#888888", "#FFFF00");
		}

		legendContainer.innerHTML = html;
	}
}