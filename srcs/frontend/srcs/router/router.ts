/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:37:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 21:02:49 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS WHO ROUTE FOR THE SINGLE PAGE APPLICATION (SPA)


/* ====================== IMPORT ====================== */

import { User }			from '../user/user.js';
import { pathActions }	from './navigationUtils.js'

import type { GameState }	from '../index.js'


/* ====================== INTERFACE ====================== */

interface Route {
	path: string;
	component: () => string | Promise<string>;
}


/* ====================== CLASS ====================== */

export class	Router {
	private routes: Route[] = [];

	addRoute(path: string, component: () => string | Promise<string>) {
		this.routes.push({ path, component });
	}

	navigate(path: string, gameState: GameState, user: User) {
		history.pushState({}, '', path);
		this.render(gameState, user);
	}

	async render(gameState: GameState, user: User) {

		const currentPath = window.location.pathname;
		const route = this.routes.find(r => r.path === currentPath);

		if (route) {
			const contentDiv = document.getElementById('app');
			if (contentDiv) {
				const html = await route.component();
				contentDiv.innerHTML = html;
			}

			pathActions(currentPath, gameState, user);
		}

	}
}