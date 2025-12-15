/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tank.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:37:08 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:30:41 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORTS ============================= */

import { GSTATE, History }								from "./global.js"
import { router }										from "../index.js"
import { Map }											from "./class_map.js"
import { Tank, Uzi, Sniper, Shotgun, Classic } 			from "./class_tank.js"
import { Ball, Collectible }							from "./class_ball.js"
import { Rect2D } 										from "./class_rect.js"
import { Input }										from "./class_input.js"
import { AppState, appStore, UserState }				from "../objects/store.js"
import { Game }											from "../Pong/gameClass.js"
import { sendRequest }									from "../utils/sendRequest.js"

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
  	private player1Name: string = "Player 1";
  	private player2Name: string = "Player 2";
	private lastCollectibleSpawn: number = 0;

	constructor(
		private canvasId: string, 
		private map_name: string,
		private powerupFrequency: number = 0,
		private star1: boolean = false,
	  	private star2: boolean = false,
	  	private star3: boolean = false,
		private p1Class: string = "classic",
		private p2Class: string = "classic"
	) {
		super();
		(window as any).quitGame = () => this.quitGame();
	}

	public setCtx(): void {
		this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
		if (!this.canvas) this.quitGame();
		this.ctx = this.canvas.getContext('2d');
		if (!this.ctx) this.quitGame();
		this.map = new Map(this.canvas.width, this.canvas.height, 2, this.map_name);
		if (!this.map) this.quitGame();
		this.input.start();

		const	state: AppState = appStore.getState();
		if (!state) this.quitGame();
		const	user: UserState = state.user;
		this.player1Name = user.username ? user.username : "Player 1";
		this.player2Name = "Player 2";
		this.lastCollectibleSpawn = Date.now();
		GSTATE.STATE = state;
		GSTATE.CANVAS = this.canvas;
		GSTATE.CTX = this.ctx;
		GSTATE.REDRAW = true;
		this.reset_state();
		this.updateNameDisplay();
		this.setup_tanks();
		this.generateLegend();
	}

	setWinningScore(newWinningScore: number) {}

	private setup_tanks() : void 
	{
		if (!this.map) return;
		GSTATE.TANKS = 0;
		const	tankWidth:number = 40;
		const	tankHeight:number = 40;
		const	colorBody:Color = {r:50,g:200,b:30}
		const	p1colorFire:Color = {r:0,g:255,b:255};
		const	p2colorFire:Color = {r:255,g:0,b:255};
		const	p1Keys:Keys = {up:'w', down:'s', left:'a', right:'d', rot_left:'b', rot_right:'n', fire:'b', ability:'n'};
		const	p2Keys:Keys = {up:'arrowup', down:'arrowdown', left:'arrowleft', right:'arrowright', rot_left:'2', rot_right:'3', fire:'1', ability:'2'};
		if (this.map.name == 'desertfox' || this.map.name == 'thehouse' || this.map.name == 'davinco')
		{
			const	s1 = this.map.spawns_tank1[Math.floor(Math.random() * this.map.spawns_tank1.length)];
			const	s2 = this.map.spawns_tank2[Math.floor(Math.random() * this.map.spawns_tank2.length)];

			switch (this.p1Class)
			{
				case "uzi":
					GSTATE.ACTORS.push(new Uzi(s1!.x, s1!.y, tankWidth, tankHeight, colorBody, p1colorFire, p1Keys, 0));
					break;
				case "sniper":
					GSTATE.ACTORS.push(new Sniper(s1!.x, s1!.y, tankWidth, tankHeight, colorBody, p1colorFire, p1Keys, 0));
					break;
				case "shotgun":
					GSTATE.ACTORS.push(new Shotgun(s1!.x, s1!.y, tankWidth, tankHeight, colorBody, p1colorFire, p1Keys, 0));
					break;
				case "classic":
					GSTATE.ACTORS.push(new Classic(s1!.x, s1!.y, tankWidth, tankHeight, colorBody, p1colorFire, p1Keys, 0));
					break;
			}

			switch (this.p2Class)
			{
				case "uzi":
					GSTATE.ACTORS.push(new Uzi(s2!.x, s2!.y, tankWidth, tankHeight, colorBody, p2colorFire, p2Keys, 1));
					break;
				case "sniper":
					GSTATE.ACTORS.push(new Sniper(s2!.x, s2!.y, tankWidth, tankHeight, colorBody, p2colorFire, p2Keys, 1));
					break;
				case "shotgun":
					GSTATE.ACTORS.push(new Shotgun(s2!.x, s2!.y, tankWidth, tankHeight, colorBody, p2colorFire, p2Keys, 1));
					break;
				case "classic":
					GSTATE.ACTORS.push(new Classic(s2!.x, s2!.y, tankWidth, tankHeight, colorBody, p2colorFire, p2Keys, 1));
					break;
			}
			GSTATE.TANKS += 2;
		}
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
		if (this.star2) {
			effects.push("ball_speed");
			effects.push("tank_speed");
		}
		if (this.star3) {
			effects.push("haste");
			effects.push("cdr");
		}

		if (this.map.name == 'desertfox' || this.map.name == 'thehouse' || this.map.name == 'davinco')
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
		if (!GSTATE.CANVAS || !GSTATE.CTX)
			this.quitGame();
		this.listen();
		this.update();
		this.input.update();

		this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
	}

	private listen() : void {

		if (this.input.isPressed('Escape')) {
			if (GSTATE.TANKS == 1 && this.isPaused) {
				this.quitGame();
			}
			else if (GSTATE.TANKS != 1) {
				this.isPaused = !this.isPaused;
				GSTATE.REDRAW = true;
			}
		}
		else if (this.isPaused && this.input.isPressed('r'))
		{
			if (GSTATE.TANKS == 1 && this.isPaused) {
				for (let a of GSTATE.ACTORS)
				{
					if (a instanceof Tank || a instanceof Ball || a instanceof Collectible)
						a.destroy();
				}
				this.setup_tanks();
				this.reset_state();
				this.updateNameDisplay()
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
				if (GSTATE.TANKS == 1){
					this.ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
					if (GSTATE.STATS1.win){
						this.ctx.fillRect(0, 0, this.canvas.width / 2, this.canvas.height);
						this.ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
						this.ctx.fillRect(this.canvas.width / 2, 0, this.canvas.width, this.canvas.height);
					}
					else {
						this.ctx.fillRect(this.canvas.width / 2, 0, this.canvas.width, this.canvas.height);
						this.ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
						this.ctx.fillRect(0, 0, this.canvas.width / 2, this.canvas.height);
					}
				}
				else {
					this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
					this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				}
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
			  	const	now = Date.now();
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
	const history: History | null = this.setHistory();
	if (history) sendRequest("/api/game", "POST", history);
	const	dashboard = document.getElementById('game-over-dashboard');
	if (!dashboard) return;

	const	matchDurationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
	const	minutes = Math.floor(matchDurationSeconds / 60);
	const	seconds = matchDurationSeconds % 60;

	const	winnerName = GSTATE.STATS1.win == 1 ? this.player1Name : this.player2Name;
	const	winnerDisplay = document.getElementById('winner-display');

	if (winnerDisplay) winnerDisplay.innerText = `${winnerName} Wins!`;

	const	accuracy1: number = GSTATE.STATS1.fire > 0 ? (GSTATE.STATS1.hit) / GSTATE.STATS1.fire * 100 : 0;
	const	accuracy2: number = GSTATE.STATS2.fire > 0 ? (GSTATE.STATS2.hit) / GSTATE.STATS2.fire * 100 : 0;

	let e: HTMLElement | null;

	e = document.getElementById('stat-duration'); 		if (e) e.innerText = `${minutes}m ${seconds}s`;

	e = document.getElementById('p1-stat-name');		if (e) e.innerText = this.player1Name + "";
	e = document.getElementById('stat-p1-accuracy');	if (e) e.innerText = `${accuracy1.toFixed(1)}%`;
	e = document.getElementById('stat-p1-fire');		if (e) e.innerText = `${GSTATE.STATS1.fire}`;
	e = document.getElementById('stat-p1-hit');			if (e) e.innerText = `${GSTATE.STATS1.hit}`;
	e = document.getElementById('stat-p1-bounce');		if (e) e.innerText = `${GSTATE.STATS1.bounce}`;

	e = document.getElementById('p2-stat-name'); 		if (e) e.innerText = this.player2Name + "";
	e = document.getElementById('stat-p2-accuracy'); 	if (e) e.innerText = `${accuracy2.toFixed(1)}%`;
	e = document.getElementById('stat-p2-fire'); 		if (e) e.innerText = `${GSTATE.STATS2.fire}`;
	e = document.getElementById('stat-p2-hit'); 		if (e) e.innerText = `${GSTATE.STATS2.hit}`;
	e = document.getElementById('stat-p2-bounce'); 		if (e) e.innerText = `${GSTATE.STATS2.bounce}`;

	e = document.getElementById('restart-msg');			if (e) e.innerText = "Press 'R' to Restart or 'Esc' to Quit";

	dashboard.style.display = 'block';
  }

	private hideEndGameDashboard() {
		const	dashboard = document.getElementById('game-over-dashboard');
		if (dashboard) dashboard.style.display = 'none';
	}

	private updateNameDisplay() {
		const	p1Span = document.getElementById('p1-name');
		const	p2Span = document.getElementById('p2-name');
		if (p1Span) p1Span.innerText = this.player1Name + "";
		if (p2Span) p2Span.innerText = this.player2Name + "";
  	}

	private generateLegend(): void {
		const	legendContainer = document.getElementById('powerup-legend');
		if (!legendContainer) return;

		legendContainer.style.display = 'none';
		if (this.star1 == false && this.star2 == false && this.star3 == false) return;

		legendContainer.style.display = 'flex';
		let html = '<div class="legend-title">Power-Ups</div>';

		const	createRow = (text: string, fill: string, stroke: string) => {
			return `
			<div class="legend-item">
					<div class="legend-bubble" style="background-color: ${fill}; border-color: ${stroke};"></div>
					<span>${text}</span>
			</div>`;
		};

		if (this.star1) {
			html += createRow("Health", "rgb(50, 170, 40)", "rgb(0, 0, 255)");
		}

		if (this.star2) {
			html += createRow("Movement speed", "rgb(255, 255, 0)", "rgb(0, 0, 255)");
			html += createRow("Ball speed", "rgb(0, 255, 255)", "rgb(0, 0, 255)");
		}

		if (this.star3) {
			html += createRow("Fire rate", "rgb(239, 19, 19)", "rgb(0, 0, 255)");
			html += createRow("Cooldown reduction", "rgb(247, 0, 255)", "rgb(0, 0, 255)");
		}
		legendContainer.innerHTML = html;
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
		}
	}

	private quitGame() {
		this.stop();
		router.navigate('/games');
	}

	public reset_state():void {
		GSTATE.STATS1.win = 0; 		GSTATE.STATS2.win = 0; 
		GSTATE.STATS1.lose = 0;		GSTATE.STATS2.lose = 0;
		GSTATE.STATS1.fire = 0;		GSTATE.STATS2.fire = 0;
		GSTATE.STATS1.hit = 0;		GSTATE.STATS2.hit = 0;
		GSTATE.STATS1.reflect = 0;		GSTATE.STATS2.reflect = 0;
		GSTATE.STATS1.bounce = 0;	GSTATE.STATS2.bounce = 0;
		this.startTime = Date.now();
	}
	private	draw(): void {}

	private setHistory(): History | null {

		if (!GSTATE.STATE.user.username) return null;
		return {
			idClient:1,
			gameType:2,
			winner:GSTATE.STATS1.win ? 1 : 0,
			p1:this.player1Name,
			p2:this.player2Name,
			p1score:GSTATE.STATS1.win,
			p2score:GSTATE.STATS2.win,
			mode:"pvp",
			powerup:(this.star1 || this.star2 || this.star3) ? 1 : 0,
			start:this.startTime,
			duration:Date.now() - this.startTime
		};
	}
}
