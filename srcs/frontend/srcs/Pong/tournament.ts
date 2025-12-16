/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/02 10:48:42 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 23:17:08 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE CLASS THAT HANDLE TOURNAMENTS


/* ====================== IMPORT ====================== */

import { Player, Match }	from "./objects/tournamentObjects"
import { sendRequest } from	"../utils/sendRequest"
import { PongResume } from "./objects/pongResume";
import { buildElement } from "../history/getAndRenderHistory.ts"
import { router } from "../index.ts";

/* ====================== CLASS ====================== */

export class    TournamentController {
	public players: Player[] = [];
	public matches: Match[] = [];
	public currentMatch: { id: string; p1: string; p2: string } | null = null;
	public winningScore: number = 5;
	public isRanked: boolean = false;

	constructor(players: Player[], winningScore: number, isRanked: boolean = false) {
		this.players = players;
		this.winningScore = winningScore;
		this.isRanked = isRanked;
		this.generateBracket();
	}

	private	generateBracket(): void {
		const	numPlayers: number = this.players.length;
		this.matches = [];

		let	bracketSize: number = 4;
		if (numPlayers > 8)
			bracketSize = 16;
		else if (numPlayers > 4)
			bracketSize = 8;

		const	totalRounds: number = Math.log2(bracketSize);

		for (let r = 1; r <= totalRounds; r++) {
			const	matchesInRound: number = bracketSize / Math.pow(2, r);

			for (let m: number = 1; m <= matchesInRound; m++) {
				let	nextId: string | null = null;
				if (r < totalRounds) {
					const	nextMatchNum = Math.ceil(m / 2);
					nextId = `r${r + 1}-m${nextMatchNum}`;
				}

				const	match: Match = {
					id: `r${r}-m${m}`,
					round: r,
					matchNum: m,
					player1: null,
					player2: null,
					winner: null,
					nextMatchId: nextId
				};
				this.matches.push(match);
			}
		}

		const	shuffledPlayers: Player[] = [...this.players].sort(() => Math.random() - 0.5);
		const	round1Matches: Match[] = this.matches.filter(m => m.round === 1);
		let	playerIdx = 0;

		for (const match of round1Matches) {
			if (playerIdx < numPlayers) {
				match.player1 = shuffledPlayers[playerIdx] || null;
				playerIdx++;
			} else {
				match.player1 = null;
			}
		}

		for (const match of round1Matches) {
			if (playerIdx < numPlayers) {
				match.player2 = shuffledPlayers[playerIdx] || null;
				playerIdx++;
			} else {
				match.player2 = null;
			}
		}

		for (const match of round1Matches) {
			this.processBye(match);
		}
	}

	private processBye(match: Match) {
		if (match.round !== 1)
			return;

		if (match.player1 && !match.player2) {
			match.winner = match.player1;
			this.advanceWinnerToNextRound(match);
		}
		else if (!match.player1 && match.player2) {
			match.winner = match.player2;
			this.advanceWinnerToNextRound(match);
		}
	}

	private advanceWinnerToNextRound(finishedMatch: Match) {
		if (!finishedMatch.winner || !finishedMatch.nextMatchId) return;

		const	nextMatch: Match | undefined = this.matches.find(m => m.id === finishedMatch.nextMatchId);
		if (!nextMatch) return;

		if (finishedMatch.matchNum % 2 !== 0) {
			nextMatch.player1 = finishedMatch.winner;
		} else {
			nextMatch.player2 = finishedMatch.winner;
		}

		this.processBye(nextMatch); 
	}

	public renderBracket(): HTMLDivElement {
		const bracketContainer = buildElement('div', ['bracket-container']);
	
		const roundsObj: { [key: number]: Match[] } = {};
		this.matches.forEach(m => {
			if (!roundsObj[m.round]) roundsObj[m.round] = [];
			roundsObj[m.round]!.push(m);
		});
		const roundNumbers: number[] = Object.keys(roundsObj).map(Number).sort((a, b) => a - b);

		for (const r of roundNumbers) {
			const column = buildElement('div', ['round-column'], "", [
				buildElement('h3', [], `Round ${r}`)
			]);
		
			for (const match of roundsObj[r]!) {
				const matchCard = buildElement('div', ['match-card'], "", [
				
					buildElement('div', ['match-info'], "", [
						buildElement('div', ['player', 'p1'], "Player 1"), 
						buildElement('div', ['vs'], "VS"),
						buildElement('div', ['player', 'p2'], "Player 2")
					]),
					buildElement('div', ['match-action']) 
				]);

				matchCard.id = match.id.toString();
				column.appendChild(matchCard);
			}
			bracketContainer.appendChild(column);
		}
		return bracketContainer;
	}

	public fillBracket(): void {
		for (const match of this.matches) {
			const card = document.getElementById(match.id);
			if (!card) continue;

			const p1El = card.querySelector('.p1');
			const p2El = card.querySelector('.p2');
			const actionEl = card.querySelector('.match-action');

			const p1Name = match.player1?.name || (match.round === 1 ? 'BYE' : 'TBD');
			const p2Name = match.player2?.name || (match.round === 1 ? 'BYE' : 'TBD');

			if (p1El) p1El.textContent = p1Name;
			if (p2El) p2El.textContent = p2Name;

			if (p1El) p1El.classList.remove('winner');
			if (p2El) p2El.classList.remove('winner');

			if (p1El && match.winner === match.player1) p1El.classList.add('winner');
			if (p2El && match.winner === match.player2) p2El.classList.add('winner');

			if (actionEl) {
				actionEl.innerHTML = '';
			
				if (!match.winner && match.player1 && match.player2) {
					const btn = document.createElement('button');
					btn.className = 'btn-yellow btn-sm';
					btn.textContent = 'Play';
					btn.onclick = () => {
					   (window as any).startTournamentMatch(match.id, p1Name, p2Name);
					};
					actionEl.appendChild(btn);
				} 
				else if (match.winner) {
					actionEl.textContent = '✅ Finished';
				}
			}
		}
		this.checkTournamentEnded();
	}

	private checkTournamentEnded(): void {
		const finalMatch = this.matches.find(m => !m.nextMatchId);

		if (finalMatch && finalMatch.winner) {
			const container = document.querySelector('.game-container');
			if (container && !document.getElementById('quit-tournament-btn')) {
				const btn = document.createElement('button');
				btn.id = 'quit-tournament-btn';
				btn.className = 'btn-exit-tournament';
				btn.textContent = 'Return to Menu';
				
				btn.onclick = () => {
					router.navigate("/tournament-menu");
				}
				container.appendChild(btn);
			}
		}
	}
	
	public startMatch(id: string, p1: string, p2: string) {
		this.currentMatch = { id, p1, p2 };
	}

	public async reportMatchWinner(winnerName: string, resume:PongResume) {
		if (!this.currentMatch) return;
		
		const match: Match | undefined = this.matches.find(m => m.id === this.currentMatch!.id);
		if (match && match.player1 && match.player2) {
			match.winner = match.player1.name === winnerName ? match.player1 : match.player2;
			
			if (this.isRanked) {
				await this.saveMatchResult(match.player1, match.player2, match.winner, resume);
			}

			this.advanceWinnerToNextRound(match);
		}
	}

	private async saveMatchResult(p1: Player, p2: Player, winner: Player, resume:PongResume) {
		try {
			const p1payload = {
				idClient:p1.id,
				gameType:1,
				winner:winner.id,
				p1:p1.name,
				p2:p2.name,
				p1score:resume.score1,
				p2score:resume.score2,
				mode:"tour",
				powerup:0,
				start:Date.now() - resume.duration,
				duration:resume.duration
			};

			const p2payload = {
				idClient:p2.id,
				gameType:1,
				winner:winner.id,
				p1:p2.name,
				p2:p1.name,
				p1score:resume.score2,
				p2score:resume.score1,
				mode:"tour",
				powerup:0,
				start:Date.now() - resume.duration,
				duration:resume.duration
			};

			await sendRequest('POST', '/', p1payload); 
			await sendRequest('POST', '/', p2payload); 
		} catch (error) {
			console.error("Error while saving tournamente match", error);
		}
	}
}