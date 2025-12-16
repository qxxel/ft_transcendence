/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   initNotificationSync.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/10 18:23:25 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/10 18:26:02 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT SETUP THE SUBSCRIBE TO STORE FOR CONNECTION TO SSE WHEN USER IS CONNECTED


/* ====================== IMPORTS ====================== */

import { appStore, AppState }	from "../objects/store.js"
import { notificationService }	from "../utils/notifService.js"


/* ====================== FUNCTION ====================== */

export function	initNotificationSync(): void {
	let isConnected = false;

	console.log("[NotificationSync] Initialized monitoring");

	appStore.subscribe((state: AppState) => {
		if (state.user && !isConnected)
		{
			notificationService.connect();
			isConnected = true;
			return ;
		}

		if (!state.user && isConnected)
		{
			notificationService.disconnect();
			isConnected = false;
		}
	});
}
