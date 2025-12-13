/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   store.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 13:16:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:45:36 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// 


export class	Store<T> {
	private	state: T;
	private	subscribers: ((state: T) => void)[];

	constructor(initialState: T) {
		this.state = initialState;
		this.subscribers = [];
	}

	getState(): T {
		return this.state;
	}

	setState(newState: Partial<T> | ((currentState: T) => Partial<T>)) {
		const	changes = typeof newState === 'function' ? newState(this.state) : newState;

		this.state = { ...this.state, ...changes };

		this.notify();
	}

	subscribe(callback: (state: T) => void): () => void {
		this.subscribers.push(callback);

		return () => {
			this.subscribers = this.subscribers.filter(sub => sub !== callback);
		};
	}

	private notify() {
		this.subscribers.forEach(callback => callback(this.state));
	}
}