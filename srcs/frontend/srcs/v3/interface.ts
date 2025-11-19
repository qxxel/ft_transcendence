export interface Color { // will be a class for the futur because we maybe want change color logic later on.
  r:number;
  g:number;
  b:number;
} 

export interface Keys {
  up: string,
  down: string,
  left: string,
  right: string,
  rot_left: string,
  rot_right: string,
  fire: string
}
