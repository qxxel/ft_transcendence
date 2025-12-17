/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   global.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:34:48 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 15:58:14 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT DEFINES GLOBAL GAME STATE, SHARED INTERFACES, AND RUNTIME VARIABLES


/* ============================= IMPORT ============================= */

import { Actor }	from "./class_actor.js"
import { AppState }	from "../objects/store.js";

/* ============================= INTERFACE ============================= */

export interface	Spawn {
	x:number;
	y:number;
}

export interface	History {
		gameType:number;
		winner:number;
		p1:string;
		p2:string;
		p1score:number;
		p2score:number;
		mode:string;
		powerup:number;
		start:number;
		duration:number;
}

export interface	ResumeStats {
	gameType: "tank";
	winner: boolean;
	time: number;
	kills: number;
}

export interface	Stats {
	win:number;
	lose:number;
	fire:number;
	hit:number;
	reflect:number;
	bounce:number;
}

export interface	GlobalState {
	ACTORS: Actor[];
	TANKS: number;
	STATE: AppState;
	CANVAS: HTMLCanvasElement;
	CTX: CanvasRenderingContext2D | null;
	REDRAW: boolean;
	STATS1: Stats;
	STATS2: Stats;
}


/* ============================= GLOBAL STATE VARIABLES ============================= */

export const	GSTATE: GlobalState = {
	ACTORS: [],
	TANKS: 0,
	STATE: undefined as unknown as AppState,
	CANVAS: undefined as unknown as HTMLCanvasElement,
	CTX: undefined as unknown as CanvasRenderingContext2D,
	REDRAW: true as boolean,
	STATS1: {win:0,lose:0,fire:0,hit:0,reflect:0,bounce:0} as Stats,
	STATS2: {win:0,lose:0,fire:0,hit:0,reflect:0,bounce:0} as Stats,
};

export const	Stats: Stats = {
	win: 0 as number,
	lose: 0 as number,
	fire: 0 as number,
	hit: 0 as number,
	reflect: 0 as number,
	bounce: 0 as number,
}

/*

export let GSTATE = {
	ACTORS: [] as Actor[],
	CANVAS!: HTMLCanvasElement,
	CTX: null as CanvasRenderingContext2D | null
};

*/