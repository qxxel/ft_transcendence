/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 13:32:52 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/17 21:45:03 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE THE LOAD OF THE PAGE


/* ====================== IMPORTS ====================== */

import axios		from 'axios'
import { User }		from "../user/user.js";
import { router }	from "../index.js";

import type { Axios, AxiosResponse }	from 'axios';
import type { GameState }		from "../index.js";


/* ====================== FUNCTIONS ====================== */

async function getUserAuth(): Promise<AxiosResponse<any, any, {}> | void> {
	try {
		const response = await axios.get('/api/jwt/validate', { withCredentials: true });

		return response;
	} catch (err: any) {
		if (err.response && err.response.status === 401) {
			console.log("Token expired, try to refresh.");

			try {
				await axios.get('/api/jwt/refresh', { withCredentials: true });

				const retryResponse = await axios.get('/api/user/auth', { withCredentials: true });
				return retryResponse;

			} catch (err: any) {
				console.error("Refresh failed, user needs to login.");
				return ;
			}
		}

		console.error("Error:", err);
		return ; 
	}
}

async function	handleLoadPage(gameState: GameState, user: User): Promise<void> {
	document.addEventListener("DOMContentLoaded", async (event) => {
		console.log("DOMContentLoaded");

		const	response = await getUserAuth();

		if (!response)
			return ;

		const result = response.data;

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