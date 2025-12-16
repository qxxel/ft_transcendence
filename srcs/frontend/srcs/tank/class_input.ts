/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_input.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:27:39 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:31:27 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS THAT HANDLES KEYBOARD INPUT STATES AND KEY PRESS EVENTS


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
