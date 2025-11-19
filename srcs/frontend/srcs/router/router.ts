/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:37:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:21:39 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// class	WHO ROUTE FOR THE SINGLE PAGE APPLICATION (SPA)


/* ====================== IMPORTS ====================== */

import { pathActions }	from "./navigationUtils.js"
import { User }			from "../user/user.js"

import type { GameState }	from "../index.js"


/* ====================== INTERFACE ====================== */

interface	Route {
	path: string;
	component: () => string | Promise<string>;
}


/* ====================== CLASS ====================== */

export class	Router {
	private	routes: Route[] = [];

	addRoute(path: string, component: () => string | Promise<string>): void {
		this.routes.push({ path, component });
	}

	navigate(path: string, gameState: GameState, user: User): void {
		history.pushState({}, '', path);
		this.render(gameState, user);
	}

	async render(gameState: GameState, user: User): Promise<void> {
		const	currentPath: string = window.location.pathname;
		const	route: Route | undefined = this.routes.find(r => r.path === currentPath);

		if (route) {
			const	contentDiv: HTMLElement | null = document.getElementById('app');
			if (contentDiv) {
				const	html: string = await route.component();
				contentDiv.innerHTML = html;
			}

			pathActions(currentPath, gameState, user);
		}

	}
}
