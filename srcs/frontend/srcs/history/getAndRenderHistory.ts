/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getAndRenderHistory.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 21:38:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 09:36:11 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT MAKE A GET REQUEST TO THE BACK WHEN WE ACCESS `/history` TO DISPLAY IT


/* ====================== IMPORTS ====================== */

import { displayPop }	from "../utils/display"
import { sendRequest }	from "../utils/sendRequest"

/* ====================== INTERFACE ====================== */

interface	GameObject {
	id: number;
	id_client: number;
	game_type: number;
	winner: number;
	p1: string;
	p1score: number;
	p2: string; 
	p2score: number;
	mode: string;
	powerup: number;
	start: number;
	duration: number;
}


/* ====================== FUNCTIONS ====================== */

export async function	getAndRenderHistory(targetId: number | null,
		targetName: string | null,
		aiFilter: boolean = true,
		pvpFilter: boolean = true,
		tourFilter: boolean = true,
		pongFilter: boolean = true,
		tankFilter: boolean = true
	): Promise<void> {

	try {
		let	response: Response;
		if (!targetId)
			response = await sendRequest('/api/game/me', "get", null);
		else
			response = await sendRequest(`/api/game/${targetId}`, "get", null);
		if (!response.ok)
		{
			displayPop("error", "id-error", response);
			displayErrors(targetName);
			return;
		}

		const	gamesData: GameObject[] = await response.json();

		if (!Array.isArray(gamesData))
			throw new Error("Invalid data format");

		if (gamesData.length === 0)
		{
			displayNoGame(false);
			return;
		}

		renderGames(gamesData, aiFilter, pvpFilter, tourFilter, pongFilter, tankFilter);
	} catch (error: unknown) {
		displayPop("error", "id-error", "Critical error while charging history: ", error)
		displayErrors(targetName);
	}
}

/* ====================== UTILS ====================== */

function formatTimeAgo(timestamp: number): string {
	const	now: number = Date.now();
	const	diffSeconds: number = Math.floor((now - timestamp) / 1000);

	if (diffSeconds < 60) return `${diffSeconds}s ago`;
	
	const	diffMinutes: number = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	
	const	diffHours: number = Math.floor(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	
	const	diffDays: number = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
}

function formatDuration(ms: number): string {
	const	seconds: number = Math.floor(ms / 1000);
	if (seconds < 60) return `${seconds}s`;
	
	const	minutes: number = Math.floor(seconds / 60);
	const	remainingSeconds: number = seconds % 60;
	
	if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
	
	const	hours: number = Math.floor(minutes / 60);
	const	remainingMinutes: number = minutes % 60;
	
	return `${hours}h ${remainingMinutes}m`;
}

/* ====================== RENDER FUNCTIONS ====================== */

function renderGames(
		gamesData: GameObject[], 
		aiFilter: boolean, 
		pvpFilter: boolean,
		tourFilter: boolean,
		pongFilter: boolean,
		tankFilter: boolean
	): void {
	const	historyEntriesDiv: HTMLElement | null = document.getElementById("history-entries");
	if (historyEntriesDiv instanceof HTMLDivElement) historyEntriesDiv.textContent = ""; 

	const	games: GameObject[] = gamesData.filter((game) => {
		const	modeMatch: boolean = (aiFilter && game.mode === "ai") || (pvpFilter && game.mode === "pvp") || (tourFilter && game.mode === "tour");
		
		const	typeMatch: boolean = (pongFilter && (game.game_type === 1 || game.game_type === 0)) || 
						  (tankFilter && game.game_type === 2);

		return modeMatch && typeMatch;
	});

	if (games.length === 0) {
		displayNoGame(true);
		return;
	}

	games.sort((a, b) => b.start - a.start);

	games.forEach((value: GameObject) => {
		if (historyEntriesDiv instanceof HTMLDivElement) createGameElement(historyEntriesDiv, value);
	});
}

export function buildElement<K extends keyof HTMLElementTagNameMap>(
		tag: K, 
		classes: string[] = [], 
		text: string = "", 
		children: HTMLElement[] = []
	): HTMLElementTagNameMap[K] {
	const element = document.createElement(tag);
	if (classes.length) element.classList.add(...classes.filter(Boolean));
	if (text) element.textContent = text;
	children.forEach(child => element.appendChild(child));
	return element;
}

function createGameElement(historyListDiv: HTMLDivElement, game: GameObject): void {
	const isVictory = game.winner === game.id_client;
	const isTank = game.game_type === 2;
	const isAiMode = game.mode === "ai";
	
	let p2DisplayName = game.p2 || "Player 2";
	let p2Classes = ["col-p2"];
	let aiBotBadge: HTMLElement | null = null;

	if (isAiMode) {
		const rawName = (game.p2 || "").toLowerCase();
		let difficultyClass = "diff-medium";
		
		if (rawName.includes("boris")) difficultyClass = "diff-boris";
		else if (rawName.includes("hard")) difficultyClass = "diff-hard";
		else if (rawName.includes("easy")) difficultyClass = "diff-easy";

		p2DisplayName = (game.p2 || "AI")
			.replace(/^AI\s*[-_]?\s*/i, '')
			.replace(/[()]/g, '')
			.trim()
			.toUpperCase();
			
		p2Classes.push("is-ai", difficultyClass);
		aiBotBadge = buildElement("span", ["bot-tag"], "BOT");
	}

	const powerupIcon = game.powerup 
		? buildElement("span", ["powerup-icon"], "⚡") 
		: null;
	if (powerupIcon) powerupIcon.title = "Powerups Enabled";

	const p2Children: HTMLElement[] = [];
	if (powerupIcon) p2Children.push(powerupIcon);
	if (aiBotBadge) p2Children.push(aiBotBadge);
	p2Children.push(buildElement("span", ["col-p2"], p2DisplayName));

	const p2Container = buildElement("span", p2Classes, "", p2Children);

	const gameRow = buildElement("div", ["game-row", isVictory ? "row-victory" : "row-defeat"], "", [
		buildElement("span", ["col-result", isVictory ? "text-victory" : "text-defeat"], isVictory ? "VICTORY" : "DEFEAT"),
		buildElement("span", ["col-ago"], formatTimeAgo(game.start)),
		buildElement("span", ["col-game-type", isTank ? "type-tank" : "type-pong"], isTank ? "TANK" : "PONG"),
		buildElement("span", [game.mode === "tour" ? "col-mode-tournament" : "col-mode"], game.mode),
		buildElement("span", ["col-p1"], game.p1),
		buildElement("span", ["col-score"], `${game.p1score ?? 0} - ${game.p2score ?? 0}`),
		p2Container,
		buildElement("span", ["col-duration"], `Duration ${formatDuration(game.duration)}`)
	]);

	historyListDiv.appendChild(gameRow);
}

function displayErrors(targetName: string | null): void {
	const	historyEntriesDiv: HTMLElement | null = document.getElementById("history-entries");
	
	if (!(historyEntriesDiv instanceof HTMLDivElement)) {
		displayPop("error", "id-error", "Missing history HTMLElement!");
		displayPop("error", "id-error", "Error while getting history!");
		return;
	}
	
	historyEntriesDiv.textContent = ""; 

	const	historyErrorParagraph: HTMLParagraphElement = document.createElement("p");
	historyErrorParagraph.classList.add("error-message");
	historyErrorParagraph.classList.add("history-error");
	
	if (targetName)
		historyErrorParagraph.textContent = `Error while getting history of ${targetName}.`;
	else
		historyErrorParagraph.textContent = `Error while getting your history.`;

	historyEntriesDiv.appendChild(historyErrorParagraph);
}

function displayNoGame(filter: boolean): void {
	const	historyEntriesDiv: HTMLElement | null = document.getElementById("history-entries");
	if (!(historyEntriesDiv instanceof HTMLDivElement)) {
		displayPop("error", "id-error", "Missing history HTMLElement!");
		return;
	}

	historyEntriesDiv.innerHTML = "";

	const	historyEmptyParagraph: HTMLParagraphElement = document.createElement("p");
	historyEmptyParagraph.classList.add("empty-message");
	historyEmptyParagraph.classList.add("history-empty");

	if (filter) {
		historyEmptyParagraph.textContent = "No results with current filters, try adjusting or resetting your filters.";
	} else {
		historyEmptyParagraph.textContent = "Empty match history.";
	}

	historyEntriesDiv.appendChild(historyEmptyParagraph);
}

export function initHistoryListeners(targetId: number | null, targetName: string | null = null): void {
	const	aiCheckbox: HTMLElement | null = document.getElementById('filter-ai');
	const	pvpCheckbox: HTMLElement | null = document.getElementById('filter-pvp');
	const	tourCheckbox: HTMLElement | null = document.getElementById('filter-tour');
	const	pongCheckbox: HTMLElement | null = document.getElementById('filter-pong');
	const	tankCheckbox: HTMLElement | null = document.getElementById('filter-tank');
	const	refreshBtn: HTMLElement | null = document.getElementById('refresh-history');

	if (!(aiCheckbox instanceof HTMLInputElement) ||
		!(pvpCheckbox instanceof HTMLInputElement) ||
		!(tourCheckbox instanceof HTMLInputElement) ||
		!(pongCheckbox instanceof HTMLInputElement) ||
		!(tankCheckbox instanceof HTMLInputElement)) {
		setTimeout(() => {
			requestAnimationFrame(() => initHistoryListeners(targetId, targetName));
		}, 200);
		return;
	}

	const	refreshList = () => {
		const	list: HTMLElement | null = document.getElementById('history-entries');
		if (list) list.style.opacity = "0.5";

		getAndRenderHistory(
			targetId, 
			targetName, 
			aiCheckbox.checked, 
			pvpCheckbox.checked, 
			tourCheckbox.checked,
			pongCheckbox.checked, 
			tankCheckbox.checked
		).then(() => {
			if (list) list.style.opacity = "1";
		});
	};

	aiCheckbox.onchange = refreshList;
	pvpCheckbox.onchange = refreshList;
	tourCheckbox.onchange = refreshList;
	pongCheckbox.onchange = refreshList;
	tankCheckbox.onchange = refreshList;

	if (refreshBtn instanceof HTMLButtonElement) {
		refreshBtn.onclick = () => {
			refreshBtn.style.transform = "rotate(360deg)";
			setTimeout(() => refreshBtn.style.transform = "none", 500);
			refreshList();
		};
	} else
		displayPop("error", "id-error", "Missing history HTMLElement!");
	refreshList();
}