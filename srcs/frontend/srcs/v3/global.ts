/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   global.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:34:48 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:35:58 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= IMPORT ============================= */

import { Actor }	from "./class_actor.js"


/* ============================= INTERFACE ============================= */

export interface	GlobalState {
	ACTORS: Actor[];
	TANKS: number;
	CANVAS: HTMLCanvasElement;
	CTX: CanvasRenderingContext2D;
	REDRAW: boolean;
}


/* ============================= GLOBAL STATE VARIABLES ============================= */

export const	GSTATE: GlobalState = {
	ACTORS: [],
	TANKS: 0,
	CANVAS: undefined as unknown as HTMLCanvasElement,
	CTX: undefined as unknown as CanvasRenderingContext2D,
	REDRAW: true as boolean
};

/*

export let GSTATE = {
	ACTORS: [] as Actor[],
	CANVAS!: HTMLCanvasElement,
	CTX: null as CanvasRenderingContext2D | null
};

*/