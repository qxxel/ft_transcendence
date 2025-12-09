/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notifService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 21:43:21 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/10 00:17:54 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { router } from "..";
import { getAndRenderFriends } from "../friends/getAndRenderFriends";
import { displayPop } from "./display";

// THE CLASS THAT HANDLE ALL THE NOFICATIONS AND CONNECTION TO SSE


/* ====================== CLASS ====================== */

export class	NotificationService {
	private	eventSource: EventSource | null = null;

	connect() {
		if (this.eventSource)
			this.eventSource.close();

		this.eventSource = new EventSource('/api/notifications/sse');

		this.eventSource.onmessage = (event: MessageEvent) => {
			const	data: any = JSON.parse(event.data);

			if (data.type === 'FRIEND_REQUEST')
			{
				this.showNotification(data);
				if (router.Path === "/friends")
					getAndRenderFriends();
			}
		};

		this.eventSource.onerror = () => {
			this.eventSource?.close();

			setTimeout(() => this.connect(), 5000);
		};
	}

	showNotification(data: any) {
		displayPop(`${data.message}<button id="btn-accept-${data.fromId}">Show</button>`, "notif");

		const	showButton: HTMLButtonElement = document.getElementById(`btn-accept-${data.fromId}`) as HTMLButtonElement;
		showButton?.addEventListener('click', () => {
			router.navigate("/friends");
		});
	}

	createContainer() {
		const div = document.createElement('div');
		div.id = 'notification-container';
		div.style.position = 'fixed';
		div.style.top = '20px';
		div.style.right = '20px';
		div.style.zIndex = '1000';
		document.body.appendChild(div);
		return div;
	}

	disconnect(): void {
		if (this.eventSource)
		{
			this.eventSource.close();
			this.eventSource = null;
			console.log("Notifications disconnected");
		}
	}
}

export const notificationService = new NotificationService();