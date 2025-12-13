/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_input.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:27:39 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:43:09 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= CLASS ============================= */


export class Input {
	private current = new Set<string>();
	private previous = new Set<string>();


	private blocked = new Set([
		" ",
		"arrowup",
		"arrowdown",
		"arrowleft",
		"arrowright",
	]);

	private onKeyDown = (e: KeyboardEvent) => {
		this.current.add(e.key.toLowerCase());
		if (this.blocked.has(e.key.toLowerCase()))
			e.preventDefault();
	};

	private onKeyUp = (e: KeyboardEvent) => {
		this.current.delete(e.key.toLowerCase());
		if (this.blocked.has(e.key.toLowerCase()))
			e.preventDefault();

	};

	start(): void {
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
	}

	stop(): void {
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
	}

	update(): void {
		this.previous = new Set(this.current);
	}

	isDown(key: string): boolean {
		return this.current.has(key.toLowerCase());
	}

	isPressed(key: string): boolean {
		key = key.toLowerCase();
		return this.current.has(key) && !this.previous.has(key);
	}

	isReleased(key: string): boolean {
		key = key.toLowerCase();
		return !this.current.has(key) && this.previous.has(key);
	}
}

//////////////////////////////////////////////////////////////////////////////////////// OLD
// export class	Input {
// 	private	keys: { [key: string]: boolean } = {}; //  Record<string, boolean>

// 	private	handleKeyDown = (e: KeyboardEvent) => {
// 		this.keys[e.key] = true;
// 	};

// 	private	handleKeyUp = (e: KeyboardEvent) => {
// 		this.keys[e.key] = false;
// 	};

// 	public	start(): void {
// 		window.addEventListener("keydown", this.handleKeyDown);
// 		window.addEventListener("keyup", this.handleKeyUp);
// 	}

// 	public	stop(): void {
// 		window.removeEventListener("keydown", this.handleKeyDown);
// 		window.removeEventListener("keyup", this.handleKeyUp);
// 	}

// 	public	isDown(key: string): boolean { // .toLowerCase() somewhere i guess ?
// 		return this.keys[key] === true;
// 	}

// 	public	getPressedKeys(): string[] {
// 		return Object.keys(this.keys).filter(k => this.keys[k]);
// 	}
// }