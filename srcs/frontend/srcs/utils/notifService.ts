/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notifService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 21:43:21 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:25:53 by mreynaud         ###   ########.fr       */
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
			if (data.type === "SET_ONLINE" || data.type === "SET_OFFLINE" ||
				data.type === "USERNAME_CHANGED" || data.type === "AVATAR_CHANGED")
			{
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
		const clickId: string = `notif-click-${data.fromId}`;
		displayPop("notif", clickId, data.message); // MATHIS/KILLIAN /!\ displayPop NO html 
// <div id="${clickId}" style="cursor: pointer; width: 100%; height: 100%;">${data.message}</div>
		const notifElement: HTMLElement | null = document.getElementById(clickId);
		
		if (notifElement) {
			notifElement.addEventListener('click', () => {
				router.navigate("/friends");
			});
		} else {
			displayPop("error", "id-error", "Missing HTMLElement!");
		}
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