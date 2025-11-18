/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/18 01:19:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import { User }		from "../user/user.js";
import { router }	from "../index.js";

import type { GameState }		from "../index.js";


/* ====================== FUNCTIONS ====================== */

async function	handleLoadPage(gameState: GameState, user: User): Promise<void> {
	document.addEventListener("DOMContentLoaded", async (event) => {
		console.log("DOMContentLoaded");

		let response: Response = await fetch("/api/jwt/validate", {
			method: "GET",
			credentials: "include",
		});
		
		if (response.status === 401){
			response = await fetch("/api/user/auth/refresh", {
				method: "GET",
				credentials: "include",
			});
		}

		if (!response.ok)
			return;

		const result = await response.json();

		user.setId(result.id as number);
		user.setUsername(result.username);
		user.setSigned(true);

		var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
		if (menu)
			menu.innerHTML =
				`<nav>
					<a href="/">Home</a> | 
					<a href="/about">About</a> | 
					<a href="/settings">Settings</a> |
					<a href="/user">${user.getUsername()}</a> |
					<button onclick="onClickLogout();" id="logout">Logout</button> |
					<a href="/game-menu">Play</a>
				</nav>`;

		router.navigate("/", gameState, user);
	});
}

export function	setupLoadHandler(gameState: GameState, user: User): void {
	handleLoadPage(gameState, user)
}