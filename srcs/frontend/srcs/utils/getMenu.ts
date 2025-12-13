/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getMenu.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 16:55:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:45:17 by kiparis          ###   ########.fr       */
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
		`;
	}

	return `
		<a href="/">Home</a>
		<a href="/games">Play</a>
		<a href="/tournament-setup">Tournament</a>
		<a href="/sign-in">Sign in</a>
		<a href="/sign-up">Sign up</a
	`;
}
	
