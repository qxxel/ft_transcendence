/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   heartbeat.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 05:56:35 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 09:04:04 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { displayPop } from "./display.js"
import { sendRequest } from "./sendRequest.js"

/* ====================== FUNCTION ====================== */

const	bc: BroadcastChannel = new BroadcastChannel('ping_channel');
let	pingIsLeader: number | null = null;
let	isLeader: boolean = false;
let	lastLeaderHeartbeat: number = 0;

export function heartbeat(): void {
	bc.postMessage({ type: 'need_leader' });

	sendRequest(
		'/api/ping', "POST", { }
	).then((res: Response) => {
		if (!res.ok) {
			displayPop("error", "id-error", res);
			return;
		}
		pingIsLeader = setInterval(checkLeader, 500);
	}).catch((e: unknown) => {
		displayPop("error", "id-error", e);
	});
}

function becomeLeader() {
	isLeader = true;

	if (pingIsLeader) {
		clearInterval(pingIsLeader);
		pingIsLeader = null;
	}
	setTimeout(() => {
		const	ping: number = setInterval(async () => {
			sendRequest(
				"/api/ping", "PATCH", { }
			).then((res: Response) => {
				if (!res.ok) {
					if (res.status === 401) {
						clearInterval(ping);
						clearInterval(pingLeader);
						return;
					}
					displayPop("error", "id-error", res);
				} 
			})
			.catch((e: unknown) => {
				displayPop("error", "id-error", e);
			});
		}, 15000);
	}, 15000);

	const	pingLeader: number = setInterval(() => {
		bc.postMessage({ type: 'leader' });
	}, 500);
}

function checkLeader() {
	if (Date.now() - lastLeaderHeartbeat > 1000 && !isLeader) {
		becomeLeader();
	}
}

bc.onmessage = (event: MessageEvent) => {
	const msg = event.data;
	
	switch (msg.type) {
		case 'leader':
			lastLeaderHeartbeat = Date.now()
			break;

		case 'need_leader':
			if (isLeader) bc.postMessage({ type: 'leader' })
			break;
	}
};

