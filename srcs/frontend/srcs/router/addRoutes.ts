/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   addRoutes.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:00:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:15:17 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ADD ALL ROUTES IN THE 'HOMEMADE' ROUTER


/* ====================== IMPORTS ====================== */

import { loadHtml }	from "./loadHtml.js"
import { router }	from "../index.js"


/* ====================== FUNCTIONS ====================== */

export function	addRoutes(): void {
	router.addRoute('/about', async () => {
		const	html: string = await loadHtml("pages/about.html");
		return html;
	});
	
	router.addRoute('/settings', async () => {
		const	html: string = await loadHtml("pages/settings.html");
		return html;
	});
	
	router.addRoute('/user', async () => {
		const	html: string = await loadHtml("pages/user.html");
		return html;
	});
	
	router.addRoute('/sign-in', async () => {
		const	html: string = await loadHtml("pages/sign-in.html");
		return html;
	});
	
	router.addRoute('/sign-up', async () => {
		const	html: string = await loadHtml("pages/sign-up.html");
		return html;
	});
	
	router.addRoute('/rperrot', async () => {
		const	html: string = await loadHtml("pages/rperrot.html");
		return html;
	});
	
	router.addRoute('/game-menu', async () => {
		const	html: string = await loadHtml("pages/game-menu.html");
		return html;
	});

	router.addRoute('/play', async () => {
		const	html: string = await loadHtml("pages/play.html");
		return html;
	});

	router.addRoute('/tank', async () => {
		const	html: string = await loadHtml("pages/tank.html");
		return html;
	});

	router.addRoute('/', async () => {
		const	html: string = await loadHtml("pages/home.html");
		return html;
	});
}
