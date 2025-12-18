/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:02:06 by kiparis           #+#    #+#             */
/*   Updated: 2025/12/18 16:06:01 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// MAIN PONG GAME CONTROLLER


/* ====================== IMPORTS ====================== */

import { router }					from "../index.js"
import { PongRenderer }				from "./renderer.js"
import { Game }						from "./gameClass.js"
import { TournamentController } 	from "./tournament.js"
import { AppState, appStore }		from "../objects/store.js"
import { connectSocket, socket }	from "../socket/socket.js"
import { displayPop }				from "../utils/display.js"

import type { PongState }				from "./objects/pongState.js"
import type { PongResume }				from "./objects/pongResume.js"
import type { GameOptions, PowerUps }	from "./objects/gameOptions.js"


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

	constructor(canvasId: string,
			score1Id: string,
			score2Id: string,
			winScoreId: string,) {
		super();
		this.ids = { canvas: canvasId, score1: score1Id, score2: score2Id, winScore: winScoreId };

		(window as any).quitGame = () => this.quitGame();
	}

	public setCtx() {
		this.canvas = document.getElementById(this.ids.canvas) as HTMLCanvasElement;
		if (!this.canvas) return displayPop("Missing pong HTMLElement!", "error");
		this.renderer = new PongRenderer(this.canvas);

		this.scoreElements = {
			winScore: document.getElementById(this.ids.winScore)!,
			p1: document.getElementById(this.ids.score1)!,
			p2: document.getElementById(this.ids.score2)!
		};
		if (!this.scoreElements.p1 || !this.scoreElements.p2 || !this.scoreElements.winScore) return displayPop("Missing pong HTMLElement!", "error");

		let	state: AppState = appStore.getState();
		let	pendingOptions: GameOptions | null = state.game.pendingOptions;
		if (pendingOptions)
			this.lastOptions = JSON.parse(JSON.stringify(pendingOptions));
		else if (this.lastOptions)
		{
			appStore.setState((state) => ({
				...state,
				game: {
					...state.game,
					pendingOptions: this.lastOptions
				}
			}));
		}

		state = appStore.getState();
		pendingOptions = state.game.pendingOptions;
		if (pendingOptions)
			this.lastOptions = JSON.parse(JSON.stringify(pendingOptions));

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

		if (pendingOptions?.isTournament)
		{
			const	currentTournament: TournamentController | null = state.game.currentTournament;
			this.player1Name = currentTournament?.currentMatch?.p1 || "Player 1";
			this.player2Name = currentTournament?.currentMatch?.p2 || "Player 2";
		}
		else if (pendingOptions?.mode === 'ai')
		{
			this.player1Name = state.user.username || "Player 1";
			this.player2Name = "AI (" + pendingOptions.difficulty + ")";
		}
		else
		{
			this.player1Name = state.user.username || "Player 1";
			this.player2Name = "Player 2";
		}
		this.updateNameDisplay();

		if (pendingOptions)
		{
			this.isTournament = pendingOptions.isTournament;
			this.scoreElements.winScore.innerText = pendingOptions.winningScore.toString();
			this.generateLegend(pendingOptions.activePowerUps);
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
		const	dashboard: HTMLElement | null = document.getElementById('game-over-dashboard');
		if (!dashboard) return displayPop("Missing pong HTMLElement!", "error");
		dashboard.style.display = "none";

		socket.on('game-update', (newState: PongState) => {
			this.serverState = newState;
			
			if (!this.displayState)
				this.displayState = JSON.parse(JSON.stringify(newState));
			
			this.updateScoresUI();
		});

		socket.on('game-over', (data: PongResume) => {
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

		const	state: AppState = appStore.getState();
		const	pendingOptions: GameOptions | null = state.game.pendingOptions;
		const	optionsToSend: GameOptions | null = pendingOptions || this.lastOptions;

		if (optionsToSend)
		{
			if (!this.lastOptions)
				this.lastOptions = JSON.parse(JSON.stringify(optionsToSend));


			socket.emit('join-game', optionsToSend);

			appStore.setState((state) => ({
				...state,
				game: {
					...state.game,
					pendingOptions: null
				}
			}));
		}
	}

	private quitGame() {
		this.stop();
		this.isGameOver = false;
		socket?.emit('leave-game');
		router.navigate('/games');
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

		this.isGameOver = false;
		
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		
		if (socket)
		{
			socket.emit('leave-game');
			socket.off('game-update');
			socket.off('game-over');
		}
	}

	private renderLoop() {
		if (!socket.active)
		{
			displayPop("You have been deconnected !", "error");
			router.navigate('/');
			return ;
		}

		this.syncServerDisplay();
		this.draw();
		this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
	}

	private syncServerDisplay() {
		if (!this.serverState || !this.displayState)
			return;

		this.displayState.ball.x = this.serverState.ball.x;
		this.displayState.ball.y = this.serverState.ball.y;

		this.displayState.paddle1.y = this.serverState.paddle1.y;
		this.displayState.paddle2.y = this.serverState.paddle2.y;

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
				if (e.key === 'r')
				{
					this.stop();
					router.navigate("/tournament-bracket")
					return;
				}
			}
			else
			{
				if (e.key === 'r')
				{
					this.stop();
					this.isGameOver = false;
					router.navigate("/pong")
					return;
				}
				if (e.key === 'Escape')
				{
					this.stop();
					this.isGameOver = false;
					router.navigate('/games');
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

	private showEndGameDashboard(pongResume: PongResume) {
		if (this.scoreElements)
		{
			this.scoreElements.p1.innerText = pongResume.score1.toString();
			this.scoreElements.p2.innerText = pongResume.score2.toString();
		}

		const	dashboard: HTMLElement | null = document.getElementById('game-over-dashboard');
		if (!dashboard) return displayPop("Missing pong HTMLElement!", "error");

		const	winnerName: string = pongResume.winner === 1 ? this.player1Name : this.player2Name;
		const	winnerDisplay: HTMLElement | null = document.getElementById('winner-display');
		if (!winnerDisplay) return displayPop("Missing pong HTMLElement!", "error");
		winnerDisplay.innerText = `${winnerName} Wins!`;

		const	state: AppState = appStore.getState();
		const	currentTournament: TournamentController | null = state.game.currentTournament;
		if (this.isTournament && currentTournament)
			currentTournament.reportMatchWinner(winnerName, pongResume);


		const	gameDurationSec: number = (pongResume.duration / 1000)
		const	minutes: string = (gameDurationSec / 60).toFixed(0);
		const	minutesText: string = minutes === "0" ? "" : minutes + "m ";
		const	seconds: string = (gameDurationSec % 60).toFixed(0);
		const	secondsText: string = seconds + "s"

		if (document.getElementById('stat-duration')) document.getElementById('stat-duration')!.innerText = minutesText + secondsText;
		if (document.getElementById('stat-p1-hits')) document.getElementById('stat-p1-hits')!.innerText = pongResume.player1Hits.toString();
		if (document.getElementById('stat-p2-hits')) document.getElementById('stat-p2-hits')!.innerText = pongResume.player2Hits.toString();
		if (document.getElementById('stat-rally')) document.getElementById('stat-rally')!.innerText = pongResume.longestRally.toString();

		const	restartMsg: HTMLElement | null = document.getElementById('restart-msg');
		if (restartMsg)
		{
			if (this.isTournament)
				restartMsg.innerText = "Press 'R' to Continue";
			else
				restartMsg.innerText = "Press 'R' to Restart or 'Esc' to Quit";
		}

		dashboard.style.display = 'block';
	}

	private updateNameDisplay() {
		const	p1Span: HTMLElement | null = document.getElementById('p1-name');
		const	p2Span: HTMLElement | null = document.getElementById('p2-name');
		if (!p1Span) return displayPop("Missing pong HTMLElement!", "error"); 
		p1Span.innerText = this.player1Name + ": ";
		if (!p2Span) return displayPop("Missing pong HTMLElement!", "error"); 
		p2Span.innerText = this.player2Name + ": ";
	}

	private generateLegend(activePowerUps: PowerUps) {
		const	legendContainer: HTMLElement | null = document.getElementById('powerup-legend');
		if (!legendContainer) return displayPop("Missing pong HTMLElement!", "error");

		legendContainer.innerHTML = '';
		legendContainer.style.display = 'none';

		if (!activePowerUps.star1 && !activePowerUps.star2 && !activePowerUps.star3) return;

		legendContainer.style.display = 'flex';
		let	html: string = '<div class="legend-title">Power-Ups</div>';

		const	createRow = (text: string, fill: string, stroke: string) => {
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