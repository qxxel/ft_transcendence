/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   addRoutes.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:00:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/09 14:54:23 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import { router } from "../index.js";
import { loadHtml } from './loadHtml.js'


/* ====================== FUNCTIONS ====================== */

export function	addRoutes(): void {
	router.addRoute("/2fa", async () => {
		const html = await loadHtml("pages/2fa.html");
		return html;
	});

	router.addRoute("/about", async () => {
		const html = await loadHtml("pages/about.html");
		return html;
	});
	
	router.addRoute("/settings", async () => {
		const html = await loadHtml("pages/settings.html");
		return html;
	});
	
	router.addRoute("/user", async () => {
		const html = await loadHtml("pages/user.html");
		return html;
	});
	
	router.addRoute("/sign-in", async () => {
		const html = await loadHtml("pages/sign-in.html");
		return html;
	});
	
	router.addRoute("/sign-up", async () => {
		const html = await loadHtml("pages/sign-up.html");
		return html;
	});
	
	router.addRoute("/rperrot", async () => {
		const html = await loadHtml("pages/rperrot.html");
		return html;
	});
	
	router.addRoute("/game-menu", async () => {
		const html = await loadHtml("pages/game-menu.html");
		return html;
	});
	
	router.addRoute("/play", async () => {
		const html = await loadHtml("pages/play.html");
		return html;
	});
	
	router.addRoute("/", async () => {
		const html = await loadHtml("pages/home.html");
		return html;
	});
}
