/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getMenu.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 16:55:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 05:13:16 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT RETURNS RIGHT MENU (SIGNED IN OR NOT)


/* ====================== IMPORTS ====================== */

import { displayPop }	from "../utils/display.js"

/* ====================== FUNCTION ====================== */

export function	getMenu(isAuth: boolean): void {
	const	menu: HTMLElement | null = document.getElementById("nav");
	if (!menu) {
		displayPop("error", "Missing navigation HTMLElement!");
		return;
	}

	if (isAuth)
	{
		menu.innerHTML = `
			<a href="/">Home</a>
			<a href="/games">Play</a>
			<a href="/tournament-menu">Tournament</a>
			<a href="/user">Profile</a>
			<a href="/friends">Friends</a>
			<a onclick="onClickLogout();" id="logout">Logout</a>
		`;
		return;
	}

	menu.innerHTML = `
		<a href="/">Home</a>
		<a href="/games">Play</a>
		<a href="/tournament-menu">Tournament</a>
		<a href="/sign-in">Sign in</a>
		<a href="/sign-up">Sign up</a
	`;
}
	
