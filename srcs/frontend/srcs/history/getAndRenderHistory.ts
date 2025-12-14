/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getAndRenderHistory.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 21:38:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:36:19 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT MAKE A GET REQUEST TO THE BACK WHEN WE ACCESS `/history` TO DISPLAY IT


/* ====================== FUNCTIONS ====================== */

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
			try {
				const	errorData: Object = await response.json();
				console.error(errorData);
			} catch (e) {
				console.error("Impossible to read JSON error", e);
			}

			displayErrors(targetName);

			return ;
		}

		const	gamesData: GameObject[] = await response.json();

		if (!Array.isArray(gamesData)) {
				console.error("Invalid data format received:", gamesData);
				throw new Error("Invalid data format");
			}

		if (gamesData.length === 0)
		{
			displayNoGame(false);
			return ;
		}

		console.log(gamesData) // ICI LE PRINT DU TABLEAU

		renderGames(gamesData, aiFilter, pvpFilter, pongFilter, tankFilter);
	} catch (error) {
		console.error("Critical error while charging history:", error);
		displayErrors(targetName);
	}
}

/* ====================== UTILS ====================== */

function formatTimeAgo(timestamp: number): string {
	const	now = Date.now();
	const	diffSeconds = Math.floor((now - timestamp) / 1000);

	if (diffSeconds < 60) return `${diffSeconds}s ago`;
	
	const	diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	
	const	diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	
	const	diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
}

function formatDuration(ms: number): string {
	const	seconds = Math.floor(ms / 1000);
	if (seconds < 60) return `${seconds}s`;
	
	const	minutes = Math.floor(seconds / 60);
	const	remainingSeconds = seconds % 60;
	
	if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
	
	const	hours = Math.floor(minutes / 60);
	const	remainingMinutes = minutes % 60;
	
	return `${hours}h ${remainingMinutes}m`;
}

/* ====================== RENDER FUNCTIONS ====================== */

function renderGames(
		gamesData: GameObject[], 
		aiFilter: boolean, 
		pvpFilter: boolean,
		pongFilter: boolean,
		tankFilter: boolean
	): void {
	const	historyEntriesDiv = document.getElementById("history-entries") as HTMLDivElement;
	if (historyEntriesDiv) historyEntriesDiv.innerHTML = ""; 

	const	games = gamesData.filter((game) => {
		const	modeMatch = (aiFilter && game.mode === "ai") || (pvpFilter && game.mode === "pvp");
		
		const	typeMatch = (pongFilter && (game.game_type === 1 || game.game_type === 0)) || 
						  (tankFilter && game.game_type === 2);

		return modeMatch && typeMatch;
	});

	if (games.length === 0) {
		displayNoGame(true);
		return;
	}

	games.sort((a, b) => b.start - a.start);

	games.forEach((value: GameObject) => {
		if (historyEntriesDiv) createGameElement(historyEntriesDiv, value);
	});
}

function createGameElement(historyListDiv: HTMLDivElement, game: GameObject): void {
	const	gameRow: HTMLDivElement = document.createElement("div");
	gameRow.classList.add("game-row");

	const	isVictory = game.winner === game.id_client;
	gameRow.classList.add(isVictory ? "row-victory" : "row-defeat");

	const	resultSpan = document.createElement("span");
	resultSpan.classList.add("col-result");
	resultSpan.textContent = isVictory ? "VICTORY" : "DEFEAT";
	resultSpan.classList.add(isVictory ? "text-victory" : "text-defeat");

	const	timeAgoSpan = document.createElement("span");
	timeAgoSpan.classList.add("col-ago");
	timeAgoSpan.textContent = formatTimeAgo(game.start);

	const	gameTypeSpan = document.createElement("span");
	gameTypeSpan.classList.add("col-game-type");
	if (game.game_type === 2) {
		gameTypeSpan.textContent = "TANK";
		gameTypeSpan.classList.add("type-tank");
	} else {
		gameTypeSpan.textContent = "PONG";
		gameTypeSpan.classList.add("type-pong");
	}

	const	durationSpan = document.createElement("span");
	durationSpan.classList.add("col-duration");
	
	durationSpan.textContent = formatDuration(game.duration);
	durationSpan.textContent = `Duration ${formatDuration(game.duration)}`;

	const	modeSpan = document.createElement("span");
	modeSpan.classList.add("col-mode");
	modeSpan.textContent = game.mode;

	const	p1NameSpan = document.createElement("span");
	p1NameSpan.classList.add("col-p1");
	p1NameSpan.textContent = game.p1;
	
	const	p2NameSpan = document.createElement("span");
	p2NameSpan.classList.add("col-p2");

	const	powerupHtml = game.powerup ? '<span class="powerup-icon" title="Powerups Enabled">⚡</span>' : '';

	if (game.mode === "ai") {
		const	rawName = (game.p2 || "").toLowerCase();
		
		let difficultyClass = "diff-medium";

		if (rawName.includes("boris")) {
			difficultyClass = "diff-boris";
		} else if (rawName.includes("hard")) {
			difficultyClass = "diff-hard";
		} else if (rawName.includes("easy")) {
			difficultyClass = "diff-easy";
		}

		let displayName = (game.p2 || "AI")
		.replace(/^AI\s*[-_]?\s*/i, '')
		.replace(/[()]/g, '')
		.trim()
		.toUpperCase();
		p2NameSpan.classList.add("is-ai");
		p2NameSpan.classList.add(difficultyClass);

		p2NameSpan.innerHTML = `<span class="bot-tag">BOT</span> ${powerupHtml}${displayName}`;
	} else {
		const	p2Name = game.p2 || "Player 2";
		p2NameSpan.innerHTML = `${powerupHtml}${p2Name}`;
	}

	const	scoreSpan = document.createElement("span");
	scoreSpan.classList.add("col-score");
	const	p1Score = game.p1score ?? (game as any).plscore ?? 0;
	const	p2Score = game.p2score ?? 0;
	scoreSpan.textContent = `${p1Score} - ${p2Score}`;

	gameRow.appendChild(resultSpan);
	gameRow.appendChild(timeAgoSpan);
	gameRow.appendChild(gameTypeSpan);
	gameRow.appendChild(modeSpan);
	gameRow.appendChild(p1NameSpan);
	gameRow.appendChild(scoreSpan);
	gameRow.appendChild(p2NameSpan);
	gameRow.appendChild(durationSpan);

	historyListDiv.appendChild(gameRow);
}

function displayErrors(targetName: string | null): void {
	const	historyEntriesDiv: HTMLDivElement = document.getElementById("history-entries") as HTMLDivElement;
	if (historyEntriesDiv)
		historyEntriesDiv.innerHTML = ""; 

	const	historyErrorParagraph: HTMLParagraphElement = document.createElement("p");
	historyErrorParagraph.classList.add("error-message");
	historyErrorParagraph.classList.add("history-error");
	
	if (targetName)
		historyErrorParagraph.textContent = `Error while getting history of ${targetName}.`;
	else
		historyErrorParagraph.textContent = `Error while getting your history.`;

	if (historyEntriesDiv)
		historyEntriesDiv.appendChild(historyErrorParagraph);
}

function displayNoGame(filter: boolean): void {
	const	historyEntriesDiv: HTMLDivElement = document.getElementById("history-entries") as HTMLDivElement;
	if (historyEntriesDiv)
		historyEntriesDiv.innerHTML = "";

	const	historyEmptyParagraph: HTMLParagraphElement = document.createElement("p");
	historyEmptyParagraph.classList.add("empty-message");
	historyEmptyParagraph.classList.add("history-empty");

	if (filter) {
		historyEmptyParagraph.textContent = "No results with current filters, try adjusting or resetting your filters.";
	} else {
		historyEmptyParagraph.textContent = "Empty match history.";
	}

	if (historyEntriesDiv)
		historyEntriesDiv.appendChild(historyEmptyParagraph);
}

export function initHistoryListeners(targetId: number | null, targetName: string | null = null, attempt: number = 0): void {
	console.log("TEST");
	const	aiCheckbox = document.getElementById('filter-ai') as HTMLInputElement;
	const	pvpCheckbox = document.getElementById('filter-pvp') as HTMLInputElement;
	const	pongCheckbox = document.getElementById('filter-pong') as HTMLInputElement;
	const	tankCheckbox = document.getElementById('filter-tank') as HTMLInputElement;
	const	refreshBtn = document.getElementById('refresh-history') as HTMLButtonElement;

	if (!aiCheckbox || !pvpCheckbox || !pongCheckbox || !tankCheckbox) {
		const	it_id = setTimeout(() => {
			requestAnimationFrame(() => initHistoryListeners(targetId, targetName, attempt + 1));
		}, 200);
		return;
	}

	const	refreshList = () => {
		const	list = document.getElementById('history-entries');
		if (list) list.style.opacity = "0.5";

		getAndRenderHistory(
			targetId, 
			targetName, 
			aiCheckbox.checked, 
			pvpCheckbox.checked, 
			pongCheckbox.checked, 
			tankCheckbox.checked
		).then(() => {
			if (list) list.style.opacity = "1";
		});
	};

	aiCheckbox.onchange = refreshList;
	pvpCheckbox.onchange = refreshList;
	pongCheckbox.onchange = refreshList;
	tankCheckbox.onchange = refreshList;

	if (refreshBtn) {
		refreshBtn.onclick = () => {
			refreshBtn.style.transform = "rotate(360deg)";
			setTimeout(() => refreshBtn.style.transform = "none", 500);
			refreshList();
		};
	}
	refreshList();
}