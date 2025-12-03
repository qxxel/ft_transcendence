/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:37:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 18:02:48 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS WHO ROUTE FOR THE SINGLE PAGE APPLICATION (SPA)


/* ====================== IMPORTS ====================== */

import { pathActions }	from "./postNavigationUtils.js"
import { User }			from "../user/user.js"

import type { AppState }					from "../index.js"


/* ====================== INTERFACE ====================== */

interface	Route {
	path: string;
	component: () => string | Promise<string>;
}


/* ====================== CLASS ====================== */

export class	Router {
	private	currentPath: string = window.location.pathname;
	private	routes: Route[] = [];
	public	canLeave = true;

	addRoute(path: string, component: () => string | Promise<string>): void {
		this.routes.push({ path, component });
	}

	navigate(path: string, gameState: AppState, user: User): void {
		if (!this.canLeave)
		{
			if (!confirm("This page is asking you to confirm that you want to leave — information you’ve entered may not be saved."))
				return ;
			this.canLeave = true;
		}
		history.pushState({}, '', path);
		this.render(gameState, user);
	}

	async render(gameState: AppState, user: User): Promise<void> {
		const	currentPath: string = window.location.pathname;
		const	route: Route | undefined = this.routes.find(r => r.path === currentPath);

		if (route)
		{
			const	contentDiv: HTMLElement | null = document.getElementById('page-content');
			if (contentDiv)
			{
				const	html: string = await route.component();
				contentDiv.innerHTML = html;
			}
			this.currentPath = currentPath;
			await pathActions(currentPath, gameState, user);
		}

	}
	
	public get Path(): string {
		return this.currentPath;
	}
	
}
