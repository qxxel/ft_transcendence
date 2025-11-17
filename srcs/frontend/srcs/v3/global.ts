import { Actor } from "./class_actor.js";

export interface GlobalState {
  ACTORS: Actor[];
  CANVAS: HTMLCanvasElement;
  CTX: CanvasRenderingContext2D;
  REDRAW: boolean;
}

export const GSTATE: GlobalState = {
  ACTORS: [],
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