/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   initNotificationSync.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/10 18:23:25 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 05:31:56 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT SETUP THE SUBSCRIBE TO STORE FOR CONNECTION TO SSE WHEN USER IS CONNECTED


/* ====================== IMPORTS ====================== */

import { appStore, AppState }	from "../objects/store.js"
import { notificationService }	from "../utils/notifService.js"


/* ====================== FUNCTION ====================== */

export function	initNotificationSync(): void {
	let	isConnected = false;
	let	connectTimeout: number | null = null;

	appStore.subscribe((state: AppState) => {
		if ((state.user && state.user.isAuth) && !isConnected)
		{
			connectTimeout = window.setTimeout(() => {
                notificationService.connect();
            }, 300);
			// notificationService.connect(); MATHIS ???
			isConnected = true;
			return;
		}

		if ((!state.user || !state.user.isAuth) && isConnected)
		{
			if (connectTimeout)
				clearTimeout(connectTimeout);
			notificationService.disconnect();
			isConnected = false;
		}
	});
}
