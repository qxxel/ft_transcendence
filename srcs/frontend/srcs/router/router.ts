/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:37:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 12:03:37 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CLASS WHO ROUTE FOR THE SINGLE PAGE APPLICATION (SPA)


/* ====================== IMPORT ====================== */

import { displayPop }				from "../utils/display.js"
import { postNavigationActions }	from "./postNavigationUtils.js"
import { preNavigationActions } from "./preNavigationUtils.js";


/* ====================== INTERFACE ====================== */

interface	Route {
	path: string;
	component: () => string | Promise<string>;
};


/* ====================== CLASS ====================== */

export class	Router {
	private	currentPath: string = window.location.pathname;
	private	routes: Route[] = [];
	public	canLeave: boolean = true;

	addRoute(path: string, component: () => string | Promise<string>): void {
		this.routes.push({ path, component });
	}

	navigate(path: string): void {
		if (!this.canLeave)
		{
			if (!confirm("This page is asking you to confirm that you want to leave — information you’ve entered may not be saved."))
				return;
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
			await preNavigationActions(currentPath)
			const	contentDiv: HTMLElement | null = document.getElementById('page-content');
			if (contentDiv) {
				const	html: string = await route.component();
				contentDiv.innerHTML = html;
			} else
				displayPop("error", "id-error", "Missing HTMLElement!");
			this.currentPath = currentPath;
			await postNavigationActions(currentPath);
		}
		else
			this.navigate("/");
	}
	
	public get Path(): string {
		return this.currentPath;
	}
	
}
