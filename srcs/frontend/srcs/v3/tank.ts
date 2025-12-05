/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tank.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:37:08 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 15:40:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { AppState, appStore, UserState }	from "../objects/store.js"
import { Game }								from "../Pong/gameClass.js"
import { GSTATE }							from "./global.js"
import { router }							from "../index.js"
import { Input }							from "./class_input.js"
import { Map }								from "./class_map.js"
import { Tank }								from "./class_tank.js"
import { Ball, Collectible }				from "./class_ball.js"

import type { Color, Keys }	from "./interface.js"
import { Wall } from "./class_wall.js"
import { Rect2D } from "./class_rect.js"


/* ============================= CLASS ============================= */

export class	TankGame extends Game {

	private	canvas: HTMLCanvasElement | null = null;
	private	ctx: CanvasRenderingContext2D | null = null;
	private	animationFrameId: number | null = null;

	private	startTime: number = 0;
	private	input: Input = new Input();
	private	map: Map | null = null;
	private	isPaused: boolean = false;
  	private player1Name: string | undefined = "Player 1";
  	private player2Name: string | undefined = "Player 2";
	private lastCollectibleSpawn: number = 0;


	// 	gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', gameState, user, mode, difficulty, star1, star2, star3); 
	constructor(
		private canvasId: string, 
		private map_name: string,
		private powerupFrequency: number = 0,
		private star1: boolean = true,
      	private star2: boolean = false,
      	private star3: boolean = false
	) {
		super();
	}

	public setCtx(): void {
		this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d')!;

		this.input = new Input();
		this.input.start();
		this.map = new Map(this.canvas.width, this.canvas.height, 2, this.map_name);

		const	state: AppState = appStore.getState();
		const	user: UserState = state.user;
        this.player1Name = user.username ? user.username : "Player 1";
        this.player2Name = "Player 2";
    	this.lastCollectibleSpawn = Date.now();
		GSTATE.REDRAW = true;
		this.updateNameDisplay()
		this.setup_tanks();
	}

	setWinningScore(newWinningScore: number) {}

	private setup_tanks() : void 
	{
		if (!this.map) return;
		GSTATE.TANKS = 0;
		let tank_width:number = 48;
		let tank_height:number = 48;

		if (this.map.name == 'desertfox')
		{
			let s1 = this.map.spawns_tank1[Math.floor(Math.random() * this.map.spawns_tank1.length)];
			let s2 = this.map.spawns_tank2[Math.floor(Math.random() * this.map.spawns_tank2.length)];

			GSTATE.ACTORS.push(new Tank(s1!.x, s1!.y, tank_width, tank_height,
				{r:50,g:200,b:30}, {r:0,g:255,b:255},
				{up:'w',down:'s',left:'a',right:'d',rot_left:'q',rot_right:'e',fire:' '},0));
			GSTATE.ACTORS.push(new Tank(s2!.x, s2!.y, tank_width, tank_height,
				{r:50,g:200,b:30}, {r:255,g:0,b:255},
				{up:'i',down:'k',left:'j',right:'l',rot_left:'u',rot_right:'o',fire:'.'},1));
			GSTATE.TANKS += 2;
		}
		else { console.log("Unknown map :", this.map.name) }

	}

	private spawn_collectible() : void 
	{
		if (!this.map || this.powerupFrequency == 0) return;
		let c_width:number = 25;
		let c_height:number = 25;
		let attempt: number = 0;
		let nope: boolean;
		let effects: string[] = [];
		if (this.star1)
			effects.push("heal");
		if (this.star2)
			effects.push("speed");
		if (this.star3)
			effects.push("haste");

		if (this.map.name == 'desertfox')
		{
			while (attempt++ < 2000)
			{
				let s = this.map.spawns_collectible[Math.floor(Math.random() * this.map.spawns_collectible.length)];
				nope = false;
				let collec: Rect2D;
				if (!s) continue;
				collec = new Rect2D(s!.x,s!.y,c_width,c_height);


				for (let a of GSTATE.ACTORS)
				{
					if (a.getRect().collide(collec))
					{
						if (a instanceof Collectible)
						{
							nope = true;
							break;
						}
					}
				}
				if (nope)
					continue;

				let index: number;
				index = Math.floor(Math.random() * effects.length);
				GSTATE.ACTORS.push(new Collectible(s!.x,s!.y,c_width,c_height, effects[index]!));
				break;
			}

		}
		GSTATE.REDRAW = true;
	}

	private	gameLoop(): void {

		this.listen();
		this.update();
		this.input.update(); // CURRENT SAVED INTO PREVIOUS

		this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
	}

	private listen() : void {

		if (this.input.isPressed('Escape')) {
			if (GSTATE.TANKS == 1 && this.isPaused) { // WANNA QUIT
			}
			else if (GSTATE.TANKS != 1) { // SWITCH PAUSE UNPAUSE
				this.isPaused = !this.isPaused;
				GSTATE.REDRAW = true;
			}
		}
		else if (this.isPaused && this.input.isPressed('r'))
		{
			if (GSTATE.TANKS == 1 && this.isPaused) { // WANNA RESTART
				for (let a of GSTATE.ACTORS)
				{
					if (a instanceof Tank || a instanceof Ball || a instanceof Collectible)
						a.destroy();
				}
				this.setup_tanks();
				this.hideEndGameDashboard();
				this.isPaused = false;
				this.startTime = Date.now();
				GSTATE.REDRAW = true;
			}
		}
	}

	private	update(): void {

		if (!this.map || !this.ctx || !this.canvas) return;
		if (GSTATE.REDRAW) {
			this.map.drawBackground(this.ctx);
			for (let a of GSTATE.ACTORS) {
					a.draw(this.ctx);
			}

			GSTATE.REDRAW = false;

			if (this.isPaused) {
				this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        		this.ctx.fillStyle = 'white';
        		this.ctx.font = '50px monospace';
        		this.ctx.textAlign = 'center';
        		if (GSTATE.TANKS != 1) this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
				return ;
			}
		}

		if (!this.isPaused) {
			for (let a of GSTATE.ACTORS) {
				a.update(this.input);
			}
			if (this.star1 || this.star2 || this.star3){
    		  	const now = Date.now();
    		  	if (now - this.lastCollectibleSpawn > (this.powerupFrequency * 1000)) {
					this.spawn_collectible();
	    	  		this.lastCollectibleSpawn = now;
    		  	}
    		}
		}
		if (!this.isPaused && GSTATE.TANKS == 1) {
			let winner: Tank;

			this.showEndGameDashboard()
			this.isPaused = true;
		}
	}
  private showEndGameDashboard() {
	this.updateNameDisplay()
    const dashboard = document.getElementById('game-over-dashboard');
    if (!dashboard) return;

    const matchDurationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(matchDurationSeconds / 60);
    const seconds = matchDurationSeconds % 60;

    const winnerName = "WINNER HERE"; //this.score1 > this.score2 ? this.player1Name : this.player2Name;
    const winnerDisplay = document.getElementById('winner-display');

	if (winnerDisplay) winnerDisplay.innerText = `${winnerName} Wins!`;

	const accuracy1 = GSTATE.STATS1.fire > 0 ? (GSTATE.STATS1.hit / GSTATE.STATS1.fire) * 100 : 0;
	const accuracy2 = GSTATE.STATS2.fire > 0 ? (GSTATE.STATS2.hit / GSTATE.STATS2.fire) * 100 : 0;

	document.getElementById('stat-duration')!.innerText = `${minutes}m ${seconds}s`;
	document.getElementById('p1-stat-name')!.innerText = 'Player 1:';
	document.getElementById('stat-p1-accuracy')!.innerText = `${accuracy1.toFixed(1)}%`;
	document.getElementById('stat-p1-fire')!.innerText = `${GSTATE.STATS1.fire}`;
	document.getElementById('stat-p1-hit')!.innerText = `${GSTATE.STATS1.hit}`;
	document.getElementById('stat-p1-bounce')!.innerText = `${GSTATE.STATS1.bounce}`;

	document.getElementById('p2-stat-name')!.innerText = 'Player 2:';
	document.getElementById('stat-p2-accuracy')!.innerText = `${accuracy2.toFixed(1)}%`;
	document.getElementById('stat-p2-fire')!.innerText = `${GSTATE.STATS2.fire}`;
	document.getElementById('stat-p2-hit')!.innerText = `${GSTATE.STATS2.hit}`;
	document.getElementById('stat-p2-bounce')!.innerText = `${GSTATE.STATS2.bounce}`;


    const restartMsg = document.getElementById('restart-msg');
    if (restartMsg) {
        restartMsg.innerText = "Press 'R' to Restart or 'Esc' to Quit";
    }

    dashboard.style.display = 'block';
  }

	private hideEndGameDashboard() {
		const dashboard = document.getElementById('game-over-dashboard');
    	if (!dashboard) return;
    	dashboard.style.display = 'none';
	}

	private updateNameDisplay() {
    const p1Span = document.getElementById('p1-name');
    const p2Span = document.getElementById('p2-name');
    if (p1Span) p1Span.innerText = this.player1Name + ": " + GSTATE.STATS1.win;
    if (p2Span) p2Span.innerText = this.player2Name + ": " + GSTATE.STATS2.win;
  	}

	public	start(): void {
		if (!this.animationFrameId) {
			this.startTime = Date.now();
			this.input.start();
			this.gameLoop();
		}
	}

	public	stop(): void {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.input.stop();
			this.animationFrameId = null;
		for (let a of GSTATE.ACTORS)
			GSTATE.ACTORS.splice(0,GSTATE.ACTORS.length)
		console.log('TankGame Stopped');
		}

	}

	private	draw(): void {}

}
