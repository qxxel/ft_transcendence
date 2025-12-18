/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   heartbeat.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 05:56:35 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/18 21:44:31 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from "./sendRequest.js";
import { displayPop } from "./display.js";

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
			displayPop(res, "error");
			return;
		}
		pingIsLeader = setInterval(checkLeader, 500);
	}).catch((e: unknown) => {
		displayPop("" + e, "error");
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
					displayPop(res, "error");
				} 
			})
			.catch((e: unknown) => {
				displayPop("" + e, "error");
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

