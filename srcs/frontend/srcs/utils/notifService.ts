/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notifService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 21:43:21 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 13:18:21 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { router }				from ".."
import { displayPop }			from "./display"
import { getAndRenderFriends }	from "../friends/getAndRenderFriends"

// THE CLASS THAT HANDLE ALL THE NOFICATIONS AND CONNECTION TO SSE


/* ====================== CLASS ====================== */

export class	NotificationService {
	private	eventSource: EventSource | null = null;
	private	isActive: boolean = false;
	private	retryCount: number = 0;
	private	retryTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		window.addEventListener('online', () => {
			this.retryCount = 0;

			if (this.isActive)
				this.connect();
		});

		window.addEventListener('offline', () => {
			if (this.eventSource)
			{
				this.eventSource.close();
				this.eventSource = null;
			}

			if (this.retryTimeout)
			{
				clearTimeout(this.retryTimeout);
				this.retryTimeout = null;
			}
		});
	}

	connect(): void {
		this.isActive = true;

		if (!navigator.onLine)
			return ;

		if (this.eventSource)
			this.eventSource.close();
		if (this.retryTimeout)
			clearTimeout(this.retryTimeout);

		this.eventSource = new EventSource('/api/notifications/sse');

		this.eventSource.onopen = () => {
			this.retryCount = 0;
		};

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
			this.eventSource = null;

			if (navigator.onLine && this.isActive)
			{
				this.retryCount++;

				const	delay: number = Math.min(1000 * (2 ** (this.retryCount - 1)), 30000);

				this.retryTimeout = setTimeout(() => {
					if (navigator.onLine && this.isActive)
						this.connect();
				}, delay);
			}
		}
	}

	async showNotification(data: any): Promise<void> {
		const clickId: string = `notif-click-${data.fromId}`;
		await displayPop("notif", clickId, data.message);

		const notifElement: HTMLElement | null = document.getElementById(clickId);
		if (notifElement)
		{
			notifElement.addEventListener('click', () => {
				router.navigate("/friends");
			});
		}
		else
			displayPop("error", "id-error", "Missing HTMLElement!");
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
		this.isActive = false;
		this.retryCount = 0;
		
		if (this.retryTimeout)
		{
			clearTimeout(this.retryTimeout);
			this.retryTimeout = null;
		}

		if (this.eventSource)
		{
			this.eventSource.close();
			this.eventSource = null;
		}
	}
}

export const notificationService = new NotificationService();