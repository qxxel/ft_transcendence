/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tabs.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/12 02:09:24 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:36:19 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import { appStore }	from "../objects/store.js"
import { router }	from "../index.js"
import { socket }	from "../socket/socket.js"


/* ====================== FUNCTIONS ====================== */

function getTabs() : number {
	const	iTabsString: string = localStorage.getItem("iTabs") || "0";
	return parseInt(iTabsString, 10);
}

export function addTabs() {
	const	iTabs: number = getTabs() + 1;
	localStorage.setItem("iTabs", JSON.stringify(iTabs));
}

export function delTabs() {
	const	iTabs: number = getTabs() - 1;
	if (iTabs > 0) {
		localStorage.setItem("iTabs", JSON.stringify(iTabs));
	}
	else {
		if (!router.canLeave && router.Path === "/sign-up") {
			navigator.sendBeacon("/api/auth/twofa/me", null);
		}

		appStore.setState((state) => ({
			...state,
			user: {
				...state.user,
				isAuth: false
			}
		}));

		navigator.sendBeacon('/api/jwt/refresh/logout', null);
		
		if (socket && socket.connected)
			socket.disconnect();
	}
}
