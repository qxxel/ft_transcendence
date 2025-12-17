/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   store.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 13:16:00 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 03:25:16 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// GENERIC STATE MANAGEMENT CLASS FOR FRONTEND, WITH SUBSCRIPTION SUPPORT


/* ====================== FUNCTION ====================== */

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
		const	changes: Partial<T> = typeof newState === 'function' ? newState(this.state) : newState;

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