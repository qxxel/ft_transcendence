/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:02:06 by kiparis           #+#    #+#             */
/*   Updated: 2025/12/03 17:53:15 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// MAIN PONG GAME CONTROLLER

/* ====================== IMPORTS ====================== */

import { connectSocket, socket }	from "../socket/socket.js"
import { Game }						from "./gameClass.js"
import { linearInterpolation }		from "./utils/lerp.js"
import { Router }					from "../router/router.js"
import { User }						from "../user/user.js"
import { PongRenderer }				from "./renderer.js"

import type { AppState }				from "../index.js"
import type { PongState }				from "./objects/gameState.js"
import type { GameOptions, PowerUps }	from "./objects/gameOptions.js"
import type { GameResume }				from "./objects/gameResume.js"


/* ====================== CLASS ====================== */

export class PongGame extends Game {
	private canvas: HTMLCanvasElement | null = null;
	private animationFrameId: number | null = null;

	private renderer: PongRenderer | null = null;

	private	lastOptions: GameOptions | null = null;
	private serverState: PongState | null = null;
	private displayState: PongState | null = null;
	private	isGameOver: boolean = false;
	private	isTournament: boolean = false;

	private player1Name: string = "Player 1";
	private player2Name: string = "Player 2";
	private scoreElements: { winScore: HTMLElement; p1: HTMLElement; p2: HTMLElement } | null = null;

	private ids: { canvas: string; score1: string; score2: string; winScore: string };

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

	public setCtx() {
		this.canvas = document.getElementById(this.ids.canvas) as HTMLCanvasElement;
		this.renderer = new PongRenderer(this.canvas);

		this.scoreElements = {
			winScore: document.getElementById(this.ids.winScore)!,
			p1: document.getElementById(this.ids.score1)!,
			p2: document.getElementById(this.ids.score2)!
		};

		if (this.appState.pendingOptions)
			this.lastOptions = JSON.parse(JSON.stringify(this.appState.pendingOptions));
		else if (this.lastOptions)
			this.appState.pendingOptions = this.lastOptions;

		if (this.appState.pendingOptions)
			this.lastOptions = JSON.parse(JSON.stringify(this.appState.pendingOptions));

		this.serverState = {
			width: this.canvas.width,
			height: this.canvas.height,
			ball: { x: this.canvas.width / 2, y: this.canvas.height / 2, radius: 7, dx: 0, dy: 0, speed: 0, lastHitter: 0 },
			paddle1: { x: 10, y: 250, width: 10, height: 100, speed: 0, hits: 0 },
			paddle2: { x: 780, y: 250, width: 10, height: 100, speed: 0, hits: 0 },
			collectibles: [],
			score1: 0,
			score2: 0,
			status: 'playing'
		};

		if (this.appState.pendingOptions?.isTournament)
		{
			this.player1Name = this.appState.currentTournament?.currentMatch?.p1 || "Player 1";
			this.player2Name = this.appState.currentTournament?.currentMatch?.p2 || "Player 2";
		}
		else if (this.appState.pendingOptions?.mode === 'ai')
		{
			this.player1Name = this.user.getUsername() || "Player 1";
			this.player2Name = "AI (" + this.appState.pendingOptions.difficulty + ")";
		}
		else
		{
			this.player1Name = "Player 1";
			this.player2Name = "Player 2";
		}
		this.updateNameDisplay();

		if (this.appState.pendingOptions)
		{
			this.isTournament = this.appState.pendingOptions.isTournament;
			this.scoreElements.winScore.innerText = this.appState.pendingOptions.winningScore.toString();
			this.generateLegend(this.appState.pendingOptions.activePowerUps);
		}

		this.connectToServer();

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	private connectToServer() {
		if (!socket || !socket.connected)
			connectSocket();

		socket.off('game-update');
		socket.off('game-over');

		this.isGameOver = false;
		this.serverState = null;

		const dashboard = document.getElementById('game-over-dashboard');
        if (dashboard)
			dashboard.style.display = "none";

		socket.on('game-update', (newState: PongState) => {
			this.serverState = newState;
			
			if (!this.displayState)
				this.displayState = JSON.parse(JSON.stringify(newState));
			
			this.updateScoresUI();
		});

		socket.on('game-over', (data: GameResume) => {
			this.isGameOver = true;

			if (this.animationFrameId)
			{
				cancelAnimationFrame(this.animationFrameId);

				socket.off('game-update');
				socket.off('game-over');

				this.animationFrameId = null;
			}
			this.showEndGameDashboard(data);
		});

		this.isGameOver = false;

		const	optionsToSend: GameOptions | null = this.appState.pendingOptions || this.lastOptions;

		if (optionsToSend)
		{
			if (!this.lastOptions)
				this.lastOptions = JSON.parse(JSON.stringify(optionsToSend));


			socket.emit('join-game', optionsToSend);

			this.appState.pendingOptions = undefined;
		}
	}

	private quitGame() {
		this.stop();
		this.isGameOver = false; 
		socket.emit('leave-game');
		this.router.navigate('/games', this.appState, this.user);
	}

	public start() {
		if (!this.animationFrameId)
		{
			this.isGameOver = false;
			window.addEventListener('keydown', this.handleKeyDown);
			window.addEventListener('keyup', this.handleKeyUp);
			this.renderLoop();
		}
	}

	public stop() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);

		socket.off('game-update');
		socket.off('game-over');
	}

	private renderLoop() {
		this.smoothState();

		this.draw();
		this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
	}

	private smoothState() {
		if (!this.serverState || !this.displayState)
			return;

		const	smoothing = 1;

		this.displayState.ball.x = linearInterpolation(this.displayState.ball.x, this.serverState.ball.x, smoothing);
		this.displayState.ball.y = linearInterpolation(this.displayState.ball.y, this.serverState.ball.y, smoothing);

		this.displayState.paddle1.y = linearInterpolation(this.displayState.paddle1.y, this.serverState.paddle1.y, smoothing);
		this.displayState.paddle2.y = linearInterpolation(this.displayState.paddle2.y, this.serverState.paddle2.y, smoothing);

		this.displayState.collectibles = this.serverState.collectibles;
		this.displayState.score1 = this.serverState.score1;
		this.displayState.score2 = this.serverState.score2;
		this.displayState.ball.radius = this.serverState.ball.radius;
		this.displayState.paddle1.height = this.serverState.paddle1.height;
		this.displayState.paddle2.height = this.serverState.paddle2.height;

		this.displayState.status = this.serverState.status;
	}

	private draw() {
		if (!this.renderer || !this.displayState)
			return;

		this.renderer.draw(
			this.displayState.paddle1, 
			this.displayState.paddle2, 
			this.displayState.ball, 
			this.displayState.collectibles
		);

		if (this.displayState.status === "paused")
			this.renderer.drawPaused();
	}

	private handleKeyDown(e: KeyboardEvent) {
		if (e.repeat)
			return;

		if (this.isGameOver) {
			if (this.isTournament)
			{
				if (e.key === ' ')
				{
					this.stop();
					this.router.navigate("/tournament-bracket", this.appState, this.user)
					return;
				}
			}
			else
			{
				if (e.key === ' ')
				{
					this.stop();
					this.isGameOver = false;
					this.router.navigate("/pong", this.appState, this.user)
					return;
				}
				if (e.key === 'Escape')
				{
					this.stop();
					this.isGameOver = false;
					this.router.navigate('/games', this.appState, this.user);
					return;
				}
			}
		}

		socket.emit('input', { key: e.key, isPressed: true });
	}

	private handleKeyUp(e: KeyboardEvent) {
		socket.emit('input', { key: e.key, isPressed: false });
	}

	private updateScoresUI() {
		if (!this.scoreElements || !this.serverState)
			return;
		this.scoreElements.p1.innerText = this.serverState.score1.toString();
		this.scoreElements.p2.innerText = this.serverState.score2.toString();
	}

	private showEndGameDashboard(gameResume: GameResume) {
		if (this.scoreElements)
		{
			this.scoreElements.p1.innerText = gameResume.score1.toString();
			this.scoreElements.p2.innerText = gameResume.score2.toString();
		}

		const dashboard = document.getElementById('game-over-dashboard');
		if (!dashboard)
			return;

		const winnerName = gameResume.winner === 1 ? this.player1Name : this.player2Name;
		const winnerDisplay = document.getElementById('winner-display');
		if (winnerDisplay)
			winnerDisplay.innerText = `${winnerName} Wins!`;
		if (this.isTournament && this.appState.currentTournament)
			this.appState.currentTournament.reportMatchWinner(winnerName);


		const	gameDurationSec: number = (gameResume.duration / 1000)
		const	minutes: string = (gameDurationSec / 60).toFixed(0);
		const	minutesText: string = minutes === "0" ? "" : minutes + "m ";
		const	seconds: string = (gameDurationSec % 60).toFixed(0);
		const	secondsText: string = seconds + "s"

		document.getElementById('stat-duration')!.innerText = minutesText + secondsText;
		document.getElementById('stat-p1-hits')!.innerText = gameResume.player1Hits.toString();
		document.getElementById('stat-p2-hits')!.innerText = gameResume.player2Hits.toString();
		document.getElementById('stat-rally')!.innerText = gameResume.longestRally.toString();

		const	restartMsg = document.getElementById('restart-msg');
		if (restartMsg)
		{
			if (this.isTournament)
				restartMsg.innerText = "Press 'Space' to Continue";
			else
				restartMsg.innerText = "Press 'Space' to Restart or 'Esc' to Quit";
		}

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