/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   class_input.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:27:39 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:28:35 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= CLASS ============================= */

export class	Input {
	private	keys: { [key: string]: boolean } = {}; //  Record<string, boolean>

	private	handleKeyDown = (e: KeyboardEvent) => {
		this.keys[e.key] = true;
	};

	private	handleKeyUp = (e: KeyboardEvent) => {
		this.keys[e.key] = false;
	};

	public	start(): void {
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}

	public	stop(): void {
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
	}

	public	isDown(key: string): boolean { // .toLowerCase() somewhere i guess ?
		return this.keys[key] === true;
	}

	public	getPressedKeys(): string[] {
		return Object.keys(this.keys).filter(k => this.keys[k]);
	}
}