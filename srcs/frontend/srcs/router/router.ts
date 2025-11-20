/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:37:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/20 04:37:34 by kiparis          ###   ########.fr       */
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


/* ====================== class	====================== */

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
			const	contentDiv: HTMLElement | null = document.getElementById('page-content');
			if (contentDiv) {
				const	html: string = await route.component();
				contentDiv.innerHTML = html;
			}

			pathActions(currentPath, gameState, user);
		}

	}
}
