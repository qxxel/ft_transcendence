/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   addRoutes.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:00:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 01:04:23 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ADD ALL ROUTES IN THE 'HOMEMADE' ROUTER


/* ====================== IMPORTS ====================== */

import { router }	from "../index.js";
import { loadHtml }	from "./loadHtml.js"


/* ====================== FUNCTIONS ====================== */

export function	addRoutes(): void {
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
	
	router.addRoute("/pongmenu", async () => {
		const html = await loadHtml("pages/pongmenu.html");
		return html;
	});

	router.addRoute("/games", async () => {
		const html = await loadHtml("pages/games.html");
		return html;
	});

	router.addRoute("/pong", async () => {
		const html = await loadHtml("pages/pong.html");
		return html;
	});

	router.addRoute("/tank", async () => {
	  const html = await loadHtml("pages/tank.html");
	  return html;
	});

	router.addRoute("/tankmenu", async () => {
	  const html = await loadHtml("pages/tankmenu.html");
	  return html;
	});

	router.addRoute("/", async () => {
		const html = await loadHtml("pages/home.html");
		return html;
	});
}
