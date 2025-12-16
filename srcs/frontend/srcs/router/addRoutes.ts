/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   addRoutes.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:00:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 06:16:49 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ADD ALL ROUTES IN THE 'HOMEMADE' ROUTER


/* ====================== IMPORTS ====================== */

import { router }	from "../index.js"
import { loadHtml }	from "./loadHtml.js"


/* ====================== FUNCTIONS ====================== */

export function	addRoutes(): void {
	router.addRoute('/2fa', async () => {
		return await loadHtml("pages/2fa.html");
	});

	router.addRoute('/user', async () => {
		return await loadHtml("pages/user.html");
	});

	router.addRoute('/friends', async () => {
		return await loadHtml("pages/friends.html");
	});

	router.addRoute('/sign-in', async () => {
		return await loadHtml("pages/sign-in.html");
	});

	router.addRoute('/sign-up', async () => {
		return await loadHtml("pages/sign-up.html");
	});

	router.addRoute("/pongmenu", async () => {
		return await loadHtml("pages/pongmenu.html");
	});

	router.addRoute("/games", async () => {
		return await loadHtml("pages/games.html");
	});

	router.addRoute("/pong", async () => {
		return await loadHtml("pages/pong.html");
	});

	router.addRoute("/tournament-setup", async () => {
		return await loadHtml("pages/tournament-setup.html");
	});

	router.addRoute("/tournament-setup-ranked", async () => {
		return await loadHtml("pages/tournament-setup-ranked.html");
	});

	router.addRoute("/tournament-menu", async () => {
		return await loadHtml("pages/tournament-menu.html");
	});

	router.addRoute("/tournament-bracket", async () => {
		return await loadHtml("pages/tournament-bracket.html");
	});

	router.addRoute('/tank', async () => {
		return await loadHtml("pages/tank.html");
	});

	router.addRoute("/tankmenu", async () => {
		return await loadHtml("pages/tankmenu.html");
	});

	router.addRoute("/history", async () => {
		return  await loadHtml("pages/history.html");
	});

	router.addRoute("/", async () => {
		return  await loadHtml("pages/home.html");
	});
}
