/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   addRoutes.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:00:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/05 11:28:48 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import { router } from "../index.js";
import { loadHtml } from './loadHtml.js'


/* ====================== FUNCTIONS ====================== */

export function	addRoutes(menu: string): void {
	router.addRoute("/about", async () => {
		const html = await loadHtml("pages/about.html");
		return menu + html;
	});
	
	router.addRoute("/settings", async () => {
		const html = await loadHtml("pages/settings.html");
		return menu + html;
	});
	
	router.addRoute("/user", async () => {
		const html = await loadHtml("pages/user.html");
		return menu + html;
	});
	
	router.addRoute("/sign-in", async () => {
		const html = await loadHtml("pages/sign-in.html");
		return menu + html;
	});
	
	router.addRoute("/sign-up", async () => {
		const html = await loadHtml("pages/sign-up.html");
		return menu + html;
	});
	
	router.addRoute("/rperrot", async () => {
		const html = await loadHtml("pages/rperrot.html");
		return menu + html;
	});
	
	router.addRoute("/game-menu", async () => {
		const html = await loadHtml("pages/game-menu.html");
		return menu + html;
	});
	
	router.addRoute("/play", async () => {
		const html = await loadHtml("pages/play.html");
		return menu + html;
	});
	
	router.addRoute("/", async () => {
		const html = await loadHtml("pages/home.html");
		return menu + html;
	});
}
