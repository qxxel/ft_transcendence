/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getAndRenderHistory.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 21:38:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 16:30:30 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT MAKE A GET REQUEST TO THE BACK WHEN WE ACCESS `/history` TO DISPLAY IT


/* ====================== FUNCTIONS ====================== */

import { Game } from "../Pong/gameClass";
import { sendRequest }	from "../utils/sendRequest"


/* ====================== INTERFACE ====================== */

interface	GameObject {
	id: number;
	id_client: number;
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

export async function	getAndRenderHistory(targetId: number | null, targetName: string | null, aiFilter: boolean = true, pvpFilter: boolean = true): Promise<void> {
	let	response: Response;
	if (!targetId)
		response = await sendRequest('/api/game/pong/me', "get", null);
	else
		response = await sendRequest(`/api/game/pong/${targetId}`, "get", null);
	if (!response.ok)
	{
		const errorData: Object = await response.json();
		console.error(errorData);

		displayErrors(targetName);
		
		return ;
	}

	const	gamesData: GameObject[] = await response.json();
	if (gamesData.length === 0)
	{
		displayNoGame(false);
		return ;
	}

	console.log(gamesData) // ICI LE PRINT DU TABLEAU

	renderGames(gamesData, aiFilter, pvpFilter);
}

/* ====================== UTILS ====================== */

function formatTimeAgo(timestamp: number): string {
	const now = Date.now();
	const diffSeconds = Math.floor((now - timestamp) / 1000);

	if (diffSeconds < 60) return `${diffSeconds}s ago`;
	
	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
}

function formatDuration(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	if (seconds < 60) return `${seconds}s`;
	
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	
	if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
	
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	
	return `${hours}h ${remainingMinutes}m`;
}

/* ====================== RENDER FUNCTIONS ====================== */

function renderGames(gamesData: GameObject[], aiFilter: boolean, pvpFilter: boolean): void {
	const historyEntriesDiv = document.getElementById("history-entries") as HTMLDivElement;
	
	if (historyEntriesDiv) historyEntriesDiv.innerHTML = ""; 

	let games: GameObject[] = [];

	if (aiFilter)
		games = games.concat(gamesData.filter((value) => value.mode === "ai"));
	if (pvpFilter)
		games = games.concat(gamesData.filter((value) => value.mode === "pvp"));

	if (games.length === 0) {
		if (historyEntriesDiv) {
			historyEntriesDiv.innerHTML = '<p class="empty-message">No matches found.</p>';
		}
		return;
	}

	games.sort((a, b) => b.start - a.start);

	games.forEach((value: GameObject) => {
		if (historyEntriesDiv) createGameElement(historyEntriesDiv, value);
	});
}

function createGameElement(historyListDiv: HTMLDivElement, game: GameObject): void {
	const gameRow: HTMLDivElement = document.createElement("div");
	gameRow.classList.add("game-row");

	const isVictory = game.winner === game.id_client;
	gameRow.classList.add(isVictory ? "row-victory" : "row-defeat");

	const resultSpan = document.createElement("span");
	resultSpan.classList.add("col-result");
	resultSpan.textContent = isVictory ? "VICTORY" : "DEFEAT";
	resultSpan.classList.add(isVictory ? "text-victory" : "text-defeat");

	const timeAgoSpan = document.createElement("span");
	timeAgoSpan.classList.add("col-ago");
	timeAgoSpan.textContent = formatTimeAgo(game.start);

	const durationSpan = document.createElement("span");
	durationSpan.classList.add("col-duration");
	
	durationSpan.textContent = formatDuration(game.duration);
	durationSpan.textContent = `Duration ${formatDuration(game.duration)}`;

	const modeSpan = document.createElement("span");
	modeSpan.classList.add("col-mode");
	modeSpan.textContent = game.mode;

	const p1NameSpan = document.createElement("span");
	p1NameSpan.classList.add("col-p1");
	p1NameSpan.textContent = game.p1;
	
	const p2NameSpan = document.createElement("span");
	p2NameSpan.classList.add("col-p2");

	if (game.mode === "ai") {
		const rawName = (game.p2 || "").toLowerCase();
		
		let difficultyClass = "diff-medium";

		if (rawName.includes("boris")) {
			difficultyClass = "diff-boris";
		} else if (rawName.includes("hard")) {
			difficultyClass = "diff-hard";
		} else if (rawName.includes("easy")) {
			difficultyClass = "diff-easy";
		}

		let displayName = (game.p2 || "AI").replace(/AI\s*-\s*/i, '').replace(/[()]/g, '').trim().toUpperCase();

		p2NameSpan.classList.add("is-ai");
		p2NameSpan.classList.add(difficultyClass);

		p2NameSpan.innerHTML = `<span class="bot-tag">BOT</span> ${displayName}`;
	} else {
		p2NameSpan.textContent = game.p2 || "Player 2";
	}

	const scoreSpan = document.createElement("span");
	scoreSpan.classList.add("col-score");
	const p1Score = game.p1score ?? (game as any).plscore ?? 0;
	const p2Score = game.p2score ?? 0;
	scoreSpan.textContent = `${p1Score} - ${p2Score}`;

	gameRow.appendChild(resultSpan);
	gameRow.appendChild(timeAgoSpan);
	gameRow.appendChild(modeSpan);
	gameRow.appendChild(p1NameSpan);
	gameRow.appendChild(scoreSpan);
	gameRow.appendChild(p2NameSpan);
	gameRow.appendChild(durationSpan);

	historyListDiv.appendChild(gameRow);
}

function displayErrors(targetName: string | null): void {
    const historyEntriesDiv: HTMLDivElement = document.getElementById("history-entries") as HTMLDivElement;
    if (!historyEntriesDiv) return;

    historyEntriesDiv.innerHTML = ""; 

    const historyErrorParagraph: HTMLParagraphElement = document.createElement("p");
    historyErrorParagraph.classList.add("error-message");
    historyErrorParagraph.classList.add("history-error");
    
    if (targetName)
        historyErrorParagraph.textContent = `Error while getting history of ${targetName}.`;
    else
        historyErrorParagraph.textContent = `Error while getting your history.`;

    historyEntriesDiv.appendChild(historyErrorParagraph);
}

function displayNoGame(filter: boolean): void {
    const historyEntriesDiv: HTMLDivElement = document.getElementById("history-entries") as HTMLDivElement;
    if (!historyEntriesDiv) return;
    historyEntriesDiv.innerHTML = "";

    const historyEmptyParagraph: HTMLParagraphElement = document.createElement("p");
    historyEmptyParagraph.classList.add("empty-message");
    historyEmptyParagraph.classList.add("history-empty");

    if (filter) {
        historyEmptyParagraph.textContent = "No results with current filters, try adjusting or resetting your filters.";
    } else {
        historyEmptyParagraph.textContent = "Empty match history.";
    }

    historyEntriesDiv.appendChild(historyEmptyParagraph);
}

export function initHistoryListeners(targetId: number | null, targetName: string | null = null, attempt: number = 0): void {
	const aiCheckbox = document.getElementById('filter-ai') as HTMLInputElement;
	const pvpCheckbox = document.getElementById('filter-pvp') as HTMLInputElement;
	const refreshBtn = document.getElementById('refresh-history') as HTMLButtonElement;

	if (!aiCheckbox || !pvpCheckbox)
	{
		if (attempt > 20)
		{
			console.error("Critical Error: Impossible de trouver les checkboxes dans le DOM après attente.");
			return;
		}
		requestAnimationFrame(() => initHistoryListeners(targetId, targetName, attempt + 1));
		return;
	}

	console.log("History DOM ready! Initializing...");

	const refreshList = () => {
		const list = document.getElementById('history-entries');
		if (list) list.style.opacity = "0.5";

		getAndRenderHistory(targetId, targetName, aiCheckbox.checked, pvpCheckbox.checked).then(() => {
			if (list) list.style.opacity = "1";
		});
	};

	aiCheckbox.onchange = refreshList;
	pvpCheckbox.onchange = refreshList;

	if (refreshBtn) {
		refreshBtn.onclick = () => {
			refreshBtn.style.transform = "rotate(360deg)";
			setTimeout(() => refreshBtn.style.transform = "none", 500);
			refreshList();
		};
	}
	refreshList();
}