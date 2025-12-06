/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getMenu.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 16:55:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/06 21:46:13 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT RETURNS RIGHT MENU (SIGNED IN OR NOT)


/* ====================== FUNCTION ====================== */

export function	getMenu(isAuth: boolean): string {
	if (isAuth)
	{
		return `
			<a href="/">Home</a>
			<a href="/games">Play</a>
			<a href="/tournament-setup">Tournament</a>
			<a href="/user">Profile</a>
			<a href="/friends">Friends</a>
			<a onclick="onClickLogout();" id="logout">Logout</a>
			<a href="/about">About</a>
		`;
	}

	return `
		<a href="/">Home</a>
		<a href="/games">Play</a>
		<a href="/tournament-setup">Tournament</a>
		<a href="/sign-in">Sign in</a>
		<a href="/sign-up">Sign up</a>
		<a href="/about">About</a>
	`;
}
	
