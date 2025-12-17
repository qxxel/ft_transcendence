/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notifService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 21:43:21 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 03:49:59 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { router } from "..";
import { getAndRenderFriends } from "../friends/getAndRenderFriends";
import { displayPop } from "./display";

// THE CLASS THAT HANDLE ALL THE NOFICATIONS AND CONNECTION TO SSE


/* ====================== CLASS ====================== */

export class	NotificationService {
	private	eventSource: EventSource | null = null;

	connect(): void {
		if (this.eventSource)
			this.eventSource.close();

		this.eventSource = new EventSource('/api/notifications/sse');

		this.eventSource.onmessage = (event: MessageEvent) => {
			const	data: any = JSON.parse(event.data);

			if (data.type === "FRIEND_REQUEST" || data.type === "FRIEND_ACCEPT")
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

	showNotification(data: any): void {
		displayPop(`${data.message}<button id="btn-accept-${data.fromId}">Show</button>`, "notif");

		const	showButton: HTMLElement | null = document.getElementById(`btn-accept-${data.fromId}`);
		if (showButton instanceof HTMLButtonElement) {
			showButton?.addEventListener('click', () => {
				router.navigate("/friends");
			});
		} else
			displayPop("Missing HTMLElement!", "error");
	}

	createContainer(): HTMLDivElement {
		const div: HTMLDivElement = document.createElement('div');
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
		}
	}
}

export const notificationService = new NotificationService();