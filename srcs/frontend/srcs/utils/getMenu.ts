/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getMenu.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/06 20:25:25 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/06 20:27:43 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== FUNCTION ====================== */

export function	getMenuLogout(): string {
	return `<a href="/">Home</a>
			<a href="/games">Play</a>
			<a href="/tournament-setup">Tournament</a>
			<a href="/sign-in">Sign in</a>
			<a href="/sign-up">Sign up</a>
			<a href="/about">About</a>`;
}

export function	getMenuLog(): string {
	return `<a href="/">Home</a>
			<a href="/games">Play</a>
			<a href="/tournament-setup">Tournament</a>
			<a href="/user">Profile</a>
			<a href="/friends">Friends</a>
			<a onclick="onClickLogout();" id="logout">Logout</a>
			<a href="/about">About</a>`;
}