/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadPage.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/14 03:21:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/18 03:45:38 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// LOAD AND DISPLAY USER AND 2FA DATA ON THE PAGE


/* ====================== IMPORTS ====================== */

import { router }						from "../index.js"
import { displayDate, displayPop }		from "../utils/display.js"
import { sendRequest }					from "../utils/sendRequest.js"
import { btnCooldown }					from "../utils/buttonCooldown.js"

/* ====================== FUNCTION ====================== */

export function loadTwofa(): void {
	sendRequest(
		`/api/jwt/payload/twofa`, 'get', null
	).then((response: Response) => {
		if (!response.ok)
		{
			displayPop(response, "error");
			router.navigate("/sign-in");
			return;
		}
		
		response.json(
		).then((result) => {
			if (result.exp)
				displayDate(result.exp * 1000);
			else
				displayPop("Unable to display the expiration date", "error");
		}).catch((e: unknown) => {
			displayPop("" + e, "error");
		});

		router.canLeave = false;
		btnCooldown();
	}).catch((e: unknown) => {
		displayPop("" + e, "error");
	});
}

export async function loadUser() {
	const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
	if (!response.ok)
	{
		displayPop(response.statusText, "error");
		return;
	}

	const	userRes: any = await response.json();

	const	responseStats: Response = await sendRequest(`/api/user/stats/me`, 'get', null);
	if (!responseStats.ok)
	{
		displayPop(responseStats, "error");
		return;
	}

	const	userStatsRes: any = await responseStats.json();
	console.log(userStatsRes);

	const statsContainer = document.getElementById("user-stats-container");
	
	if (statsContainer) {
		statsContainer.innerHTML = '';

		const pongData = {
			wins: userStatsRes.pongWins,
			losses: userStatsRes.pongLosses,
			totalTime: userStatsRes.pongTotalTime,
			specialLabel: "Points",
			specialValue: userStatsRes.pongPointsMarked
		};

		const tankData = {
			wins: userStatsRes.tankWins,
			losses: userStatsRes.tankLosses,
			totalTime: userStatsRes.tankTotalTime,
			specialLabel: "Kills",
			specialValue: userStatsRes.tankKills
		};

		const pongCard = createStatCard("Pong", "🏓", "#ffffff", pongData);
		const tankCard = createStatCard("Tank", "🚀", "#ff8888", tankData);

		statsContainer.appendChild(pongCard);
		statsContainer.appendChild(tankCard);
	}

	const	imgElement: HTMLImageElement = document.getElementById("user-avatar") as HTMLImageElement;
	const	displayImgElement: HTMLImageElement = document.getElementById("display-user-avatar") as HTMLImageElement;
	if (imgElement && displayImgElement)
	{
		if (userRes.avatar)
		{
			imgElement.src = "/uploads/" + userRes.avatar;
			displayImgElement.src = "/uploads/" + userRes.avatar;
		}
		else
		{	
			imgElement.src = "/assets/default_avatar.png";
			displayImgElement.src = "/assets/default_avatar.png";
		}
	} else
		displayPop("Missing avatar HTMLElement!", "error");

	if (userRes.is2faEnable == true) {
		const	switchSpan: HTMLElement | null = document.getElementById("switch-span");
		if (switchSpan instanceof HTMLSpanElement) {
			switchSpan.textContent = "Enabled";
			switchSpan.classList.add('status-enabled');
			switchSpan.classList.remove('status-disabled');
		}

		const	checkbox2fa: HTMLElement | null = document.getElementById("edit-2fa");
		if (checkbox2fa instanceof HTMLInputElement)
			checkbox2fa.checked = true;
		
		if (!(switchSpan instanceof HTMLInputElement) && !(checkbox2fa instanceof HTMLInputElement))
			displayPop("Missing 2fa HTMLElement!", "error");
	}

	const	usernameEl: HTMLElement | null = document.getElementById("user-username");
	const	emailEl: HTMLElement | null = document.getElementById("user-email");
	
	if (usernameEl instanceof HTMLDivElement && emailEl instanceof HTMLDivElement) {
		usernameEl.textContent = userRes.username ?? "";
		emailEl.textContent = userRes.email ?? "";
	} else
		displayPop("Missing profile HTMLElement!", "error");
}

function formatTime(seconds: number): string {
	if (!seconds) return "0m";
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m`;
}

function createStatCard(title: string, icon: string, colorClass: string, stats: any): HTMLElement {
	const card = document.createElement('div');
	card.className = "game-container stat-card";
	card.classList.add("stat-card-user");

	const header = document.createElement('h3');
	header.classList.add("stat-card-user-header");
	header.textContent = `${title} ${icon}`;
	header.style.borderBottom = `2px solid ${colorClass}`;
	card.appendChild(header);

	const grid = document.createElement('div');
	grid.style.display = "grid";
	grid.style.gridTemplateColumns = "1fr 1fr";
	grid.style.gap = "10px";

	const items = [
		{ label: "Time", value: formatTime(stats.totalTime), color: "#aaa" },
		{ label: "Wins", value: stats.wins, color: "#4CAF50" },
		{ label: "Losses", value: stats.losses, color: "#F44336" },
		{ label: stats.specialLabel, value: stats.specialValue, color: "#2196F3" }
	];

	items.forEach(item => {
		const box = document.createElement('div');
		box.classList.add("stat-box-data");

		const label = document.createElement('span');
		label.textContent = item.label;
		label.style.fontSize = "0.8em";
		label.style.color = "#888";
		label.style.marginBottom = "5px";

		const value = document.createElement('span');
		value.textContent = item.value.toString();
		value.style.fontWeight = "bold";
		value.style.color = item.color;

		box.appendChild(label);
		box.appendChild(value);
		grid.appendChild(box);
	});

	card.appendChild(grid);
	return card;
}

export async function loadUserStats(targetId: number | null, targetName: string | null = null){
	let	responseStats: Response;
	if (!targetId)
		responseStats = await sendRequest('/api/user/stats/me', "get", null);
	else
		responseStats = await sendRequest(`/api/user/stats/${targetId}`, "get", null);
	if (!responseStats.ok)
	{
		displayPop(responseStats, "error");
		return;
	}
	
	const	userStatsRes: any = await responseStats.json();

	const statsContainer = document.getElementById("user-stats-container");
	
	if (targetName){
		const nameContainer = document.getElementById("user-profile-container");
		if (nameContainer){
			nameContainer.innerHTML = '';
			const box = document.createElement('div');
			box.className = "game-container stat-card";
			box.classList.add("stat-card-user");
			const label = document.createElement('span');
			label.textContent = "Profile of " + targetName;
			box.appendChild(label);
			nameContainer.appendChild(box);
		}

	}

	if (statsContainer) {
		statsContainer.innerHTML = '';
		
		const pongData = {
			elo: userStatsRes.pongElo,
			wins: userStatsRes.pongWins,
			losses: userStatsRes.pongLosses,
			totalTime: userStatsRes.pongTotalTime,
			specialLabel: "Points",
			specialValue: userStatsRes.pongPointsMarked
		};
		const tankData = {
			elo: userStatsRes.tankElo,
			wins: userStatsRes.tankWins,
			losses: userStatsRes.tankLosses,
			totalTime: userStatsRes.tankTotalTime,
			specialLabel: "Kills",
			specialValue: userStatsRes.tankKills
		};

		const pongCard = createStatCard("Pong", "🏓", "#ffffff", pongData);
		const tankCard = createStatCard("Tank", "🚀", "#ff8888", tankData);
		
		statsContainer.appendChild(pongCard);
		statsContainer.appendChild(tankCard);
	}	
}
