/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tank.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:37:08 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/20 23:15:13 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { Game }		from "../Pong/GameClass.js"
import { GSTATE }	from "./global.js"
import { Router } from "../router/router.js"
import { Input }	from "./class_input.js"
import { User } from "../user/user.js"
import { Map }		from "./class_map.js"
import { Tank }		from "./class_tank.js"
import { Ball }		from "./class_ball.js"
import { Collectible } from "./class_collectible.js"
import { HealthPack } from "./class_collectible_health.js"

import type { Color, Keys }	from "./interface.js"


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


	// 	gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user, mode, difficulty, star1, star2, star3); 
	constructor(
		private canvasId: string, 
		private map_name: string,
		private router: Router,
		private user: User,
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
        this.player1Name = this.user.getUsername() == undefined ? "Player 1" : this.user.getUsername();
        this.player2Name = "Player 2";
    	this.lastCollectibleSpawn = Date.now();
		GSTATE.REDRAW = true;
		this.updateNameDisplay()
		this.setup_tanks();
	}

	private setup_tanks() : void 
	{
		if (!this.map) return;
		GSTATE.TANKS = 0;
		let tank_width:number = 48;
		let tank_height:number = 48;
		let colors: Color[] = [];
		colors.push( {r:0,g:255,b:255} );
		colors.push( {r:255,g:0,b:255} );

		let keys: Keys[] = [];
		keys.push( {up:'w',down:'s',left:'a',right:'d',rot_left:'q',rot_right:'e',fire:' '} );
		keys.push( {up:'i',down:'k',left:'j',right:'l',rot_left:'u',rot_right:'o',fire:'z'} );


		if (this.map.name == 'desertfox')
		{
			for (let i = 0; i < 2; ++i) {
				if (this.map.spawns_tank && this.map.spawns_tank[i]) { // SCOTCH
					const tank: Tank = new Tank(this.map.spawns_tank[i]!.x, this.map.spawns_tank[i]!.y, tank_width, tank_height, {r:0,g:255,b:0}, colors[i]!, keys[i]!,i);
					GSTATE.ACTORS.push(tank);
					GSTATE.TANKS += 1;
				}
			}
		}
		else { console.log("Unknown map :", this.map.name) }

	}

	private spawn_collectible() : void 
	{
		if (!this.map || this.powerupFrequency == 0) return;
		let collectible_width:number = 10;
		let collectible_height:number = 10;


		if (this.map.name == 'desertfox')
		{
			for (let i = 0; i < 2; ++i) {
				if (this.map.spawns_collectible && this.map.spawns_collectible[i]) { // SCOTCH
					console.log("SPAWNTHEM");
					// here we need some randomness for type + pos
					GSTATE.ACTORS.push(
						new HealthPack(this.map.spawns_collectible[i]!.x, this.map.spawns_collectible[i]!.y, collectible_width, collectible_height, {r:150,g:150,b:0}));
				}
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

    document.getElementById('stat-duration')!.innerText = `${minutes}m ${seconds}s`;
    
    document.getElementById('p1-stat-name')!.innerText = 'BOUNCE1:';
    document.getElementById('stat-p1-hits')!.innerText = `${GSTATE.STATS1.bounce}`;
    // document.getElementById('stat-p1-hits')!.innerText = 'X';

    document.getElementById('p2-stat-name')!.innerText = 'BOUNCE2:';
    document.getElementById('stat-p2-hits')!.innerText = `${GSTATE.STATS2.bounce}`;

    document.getElementById('stat-rally')!.innerText = 'X';

    const restartMsg = document.getElementById('restart-msg');
    if (restartMsg) {
        // const baseMsg = this.isTournamentMatch ? "Press 'Space' to Continue" : "Press 'Space' to Restart";
        // const escMsg = this.isTournamentMatch ? "" : " or 'Esc' to Quit";
        restartMsg.innerText = "Press 'R' to Restart or 'Esc' to Quit" //baseMsg + escMsg;
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
