/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getAndRenderHistory.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/03 21:38:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/03 23:48:55 by agerbaud         ###   ########.fr       */
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

export async function	getAndRenderHistory(targetName: string | null, aiFilter: boolean = true, pvpFilter: boolean = true): Promise<void> {
	const	response: Response = await sendRequest('/api/game/pong/me', "get", null);
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

function	renderGames(gamesData: GameObject[], aiFilter: boolean, pvpFilter: boolean): void {
	const	historyListDiv: HTMLDivElement = document.getElementById("history-list") as HTMLDivElement;
	historyListDiv.innerHTML = "<h1>History</h1>";

	if (!aiFilter && !pvpFilter)
		displayNoGame(true);
	
	let	games: GameObject[] = [];
	if (aiFilter)
		games = games.concat(gamesData.filter((value: GameObject) => { return value.mode === "ai"; }));
	if (pvpFilter)
		games = games.concat(gamesData.filter((value: GameObject) => { return value.mode === "pvp"; }));

	if (!games.length)
		displayNoGame(true);

	gamesData.forEach((value: GameObject) => {
		createGameElement(historyListDiv, value);
	});
}

function	createGameElement(historyListDiv: HTMLDivElement, game: GameObject): void {
	const	gameIdSpan: HTMLSpanElement = document.createElement("span");
	gameIdSpan.classList.add("game-id");
	gameIdSpan.textContent = game.id.toString();

	const	clientIdSpan: HTMLSpanElement = document.createElement("span");
	clientIdSpan.classList.add("client-id");
	clientIdSpan.textContent = game.id_client.toString();

	const	gameWinnerSpan: HTMLSpanElement = document.createElement("span");
	gameWinnerSpan.classList.add("game-winner");
	gameWinnerSpan.textContent = game.winner.toString();

	const	p1NameSpan: HTMLSpanElement = document.createElement("span");
	p1NameSpan.classList.add("p1-name");
	p1NameSpan.textContent = game.p1;

	const	p1ScoreSpan: HTMLSpanElement = document.createElement("span");
	p1ScoreSpan.classList.add("p1-score");
	p1ScoreSpan.textContent = game.p1score.toString();

	const	p2NameSpan: HTMLSpanElement = document.createElement("span");
	p2NameSpan.classList.add("p2-name");
	p2NameSpan.textContent = game.p2;

	const	p2ScoreSpan: HTMLSpanElement = document.createElement("span");
	p2ScoreSpan.classList.add("p2-score");
	p2ScoreSpan.textContent = game.p2score.toString();

	const	gameModeSpan: HTMLSpanElement = document.createElement("span");
	gameModeSpan.classList.add("game-mode");
	gameModeSpan.textContent = game.mode;

	const	powerupSpan: HTMLSpanElement = document.createElement("span");
	powerupSpan.classList.add("powerup");
	powerupSpan.textContent = game.powerup.toString();

	const	gameStartSpan: HTMLSpanElement = document.createElement("span");
	gameStartSpan.classList.add("game-start");
	gameStartSpan.textContent = game.start.toString();

	const	gameDurationSpan: HTMLSpanElement = document.createElement("span");
	gameDurationSpan.classList.add("game-duration");
	gameDurationSpan.textContent = game.duration.toString();

	historyListDiv.appendChild(gameIdSpan);
	historyListDiv.appendChild(clientIdSpan);
	historyListDiv.appendChild(gameWinnerSpan);
	historyListDiv.appendChild(p1NameSpan);
	historyListDiv.appendChild(p1ScoreSpan);
	historyListDiv.appendChild(p2NameSpan);
	historyListDiv.appendChild(p2ScoreSpan);
	historyListDiv.appendChild(gameModeSpan);
	historyListDiv.appendChild(powerupSpan);
	historyListDiv.appendChild(gameStartSpan);
	historyListDiv.appendChild(gameDurationSpan);
}

function	displayErrors(targetName: string | null): void {
	const	historyListDiv: HTMLDivElement = document.getElementById("history-list") as HTMLDivElement;
	historyListDiv.innerHTML = "<h1>History</h1>";

	const	historyErrorParagraph: HTMLParagraphElement = document.createElement("p");
	historyErrorParagraph.classList.add("error-message");
	historyErrorParagraph.classList.add("history-error");
	if (targetName)
		historyErrorParagraph.textContent = `Error while getting history of ${targetName}.`;
	else
		historyErrorParagraph.textContent = `Error while getting your history.`;


	historyListDiv.appendChild(historyErrorParagraph);
}

function	displayNoGame(filter: boolean): void {
	const	historyListDiv: HTMLDivElement = document.getElementById("history-list") as HTMLDivElement;
	historyListDiv.innerHTML = "<h1>History</h1>";
console.log(filter)
	if (filter)
	{
		const	historyEmptyParagraph: HTMLParagraphElement = document.createElement("p");
		historyEmptyParagraph.classList.add("empty-message");
		historyEmptyParagraph.classList.add("history-empty");
		historyEmptyParagraph.textContent = "No results with current filters, try adjusting or resetting your filters.";
		
		historyListDiv.appendChild(historyEmptyParagraph);

		return ;
	}

	const	historyEmptyParagraph: HTMLParagraphElement = document.createElement("p");
	historyEmptyParagraph.classList.add("empty-message");
	historyEmptyParagraph.classList.add("history-empty");
	historyEmptyParagraph.textContent = "Empty match history.";

	historyListDiv.appendChild(historyEmptyParagraph);
}
