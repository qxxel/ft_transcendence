/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tabs.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/12 02:09:24 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:59:57 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// MANAGES MULTI-TAB HEARTBEATS AND CLEANUP, ENSURING SINGLE ACTIVE SESSION AND LOGOUT ON LAST TAB CLOSE


/* ====================== IMPORTS ====================== */

import { router }	from "../index.js"
import { socket }	from "../socket/socket.js"
import { appStore }	from "../objects/store.js"


/* ====================== CONSTANTES ====================== */

const STORAGE_KEY = "active_tabs_heartbeats";
const HEARTBEAT_INTERVAL = 1000;
const CRASH_THRESHOLD = 3000;
const CURRENT_TAB_ID = crypto.randomUUID();


/* ====================== INTERFACE ====================== */

interface TabHeartbeat {
	id: string;
	lastSeen: number;
}


/* ====================== FUNCTIONS ====================== */

function getCleanTabs(): TabHeartbeat[] {
	const	rawData = localStorage.getItem(STORAGE_KEY);
	let	tabs: TabHeartbeat[] = [];
	
	try {
		tabs = rawData ? JSON.parse(rawData) : [];
	} catch {
		tabs = [];
	}

	const now = Date.now();
	const aliveTabs = tabs.filter(tab => (now - tab.lastSeen) < CRASH_THRESHOLD);
	
	if (aliveTabs.length !== tabs.length) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(aliveTabs));
	}
	
	return aliveTabs;
}

export function addTabs() {
	setInterval(() => {
		const tabs = getCleanTabs();
		
		const myIndex = tabs.findIndex(t => t.id === CURRENT_TAB_ID);
		if (myIndex !== -1) {
			tabs[myIndex].lastSeen = Date.now();
		} else {
			tabs.push({ id: CURRENT_TAB_ID, lastSeen: Date.now() });
		}
		
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
	}, HEARTBEAT_INTERVAL);

	const	tabs = getCleanTabs();
	if (!tabs.find(t => t.id === CURRENT_TAB_ID)) {
		tabs.push({ id: CURRENT_TAB_ID, lastSeen: Date.now() });
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
	}
}

export function delTabs() {
	let tabs = getCleanTabs();

	tabs = tabs.filter(t => t.id !== CURRENT_TAB_ID);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));

	if (tabs.length === 0) {
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
