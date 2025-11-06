/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:37:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/05 11:47:35 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import { PongGame }		from '../game/game.js';
import { User }			from '../user/user.js';
import { pathActions }	from './navigationUtils.js'

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

	navigate(path: string, currentGame: PongGame | null, user: User) {
		history.pushState({}, '', path);
		this.render(currentGame, user);
	}

	async render(currentGame: PongGame | null, user: User) {
		// stopCurrentGame();

		const currentPath = window.location.pathname;
		const route = this.routes.find(r => r.path === currentPath);

		if (route) {
			const contentDiv = document.getElementById('app');
			if (contentDiv) {
				const html = await route.component();
				contentDiv.innerHTML = html;
			}

			pathActions(currentPath, currentGame, user);
		}

	}
}