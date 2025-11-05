/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 12:01:55 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/05 12:02:10 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== CLASS ====================== */

export class User {
	private	signedIn: boolean;
	private	id?: number;
	private	username?: string;

	constructor() {
		this.signedIn = false;
	}

	logout(): void {
		this.id = undefined;
		this.username = undefined;
		this.signedIn = false;
	}

	isSignedIn(): boolean {
		return this.signedIn;
	}

	getUsername(): string | undefined {
		if (this.username)
			return this.username;
	}

	setSigned(bool: boolean) {
		this.signedIn = bool;
	}

	setUsername(username: string) {
		this.username = username;
	}

	setId(id: number) {
		this.id = id;
	}
}
