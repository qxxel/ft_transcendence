/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:37:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:42:34 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS WHO ROUTE FOR THE SINGLE PAGE APPLICATION (SPA)


/* ====================== IMPORT ====================== */

import { pathActions }			from "./postNavigationUtils.js"


/* ====================== INTERFACE ====================== */

interface	Route {
	path: string;
	component: () => string | Promise<string>;
};


/* ====================== CLASS ====================== */

export class	Router {
	private	currentPath: string = window.location.pathname;
	private	routes: Route[] = [];
	public	canLeave = true;

	addRoute(path: string, component: () => string | Promise<string>): void {
		this.routes.push({ path, component });
	}

	navigate(path: string): void {
		if (!this.canLeave)
		{
			if (!confirm("This page is asking you to confirm that you want to leave — information you’ve entered may not be saved."))
				return ;
			this.canLeave = true;
		}
		history.pushState({}, '', path);
		this.render();
	}

	async render(): Promise<void> {
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
			await pathActions(currentPath);
		}
		else
			this.navigate("/");
	}
	
	public get Path(): string {
		return this.currentPath;
	}
	
}
