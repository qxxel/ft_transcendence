/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/02 10:48:42 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 06:13:56 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE CLASS THAT HANDLE TOURNAMENTS


/* ====================== IMPORT ====================== */

import { Player, Match }	from "./objects/tournamentObjects"
import { sendRequest } from	"../utils/sendRequest"

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

	public renderBracket(): string {
		let	html: string = '<div class="bracket-container">';
		
		const	roundsObj: { [key: number]: Match[] } = {};
		
		this.matches.forEach(m => {
			if (!roundsObj[m.round]) roundsObj[m.round] = [];
			roundsObj[m.round]!.push(m);
		});

		const	roundNumbers: number[] = Object.keys(roundsObj).map(Number).sort((a, b) => a - b);

		for (const r of roundNumbers) {
			html += `<div class="round-column"><h3>Round ${r}</h3>`;
			
			for (const match of roundsObj[r]!) {
				const	p1Name: string = match.player1?.name || (match.round === 1 ? 'BYE' : 'TBD');
				const	p2Name: string = match.player2?.name || (match.round === 1 ? 'BYE' : 'TBD');
				
				const	p1Class: string = (match.winner && match.winner === match.player1) ? 'winner' : '';
				const	p2Class: string = (match.winner && match.winner === match.player2) ? 'winner' : '';
				
				let	button: string = '';
				const	isPlayable: false | Player | null = !match.winner && match.player1 && match.player2;
				
				if (isPlayable) {
					button = `<button class="btn-yellow btn-sm" 
						onclick="window.startTournamentMatch('${match.id}', '${p1Name}', '${p2Name}')">
						Play
					</button>`;
				} else if (match.winner) {
					 button = `<span class="match-done">✅ Finished</span>`;
				}

				html += `
					<div class="match-card" id="${match.id}">
						<div class="match-info">
							<div class="player ${p1Class}">${p1Name}</div>
							<div class="vs">VS</div>
							<div class="player ${p2Class}">${p2Name}</div>
						</div>
						${button}
					</div>
				`;
			}
			html += '</div>';
		}
		html += '</div>';
		return html;
	}

	public startMatch(id: string, p1: string, p2: string) {
		this.currentMatch = { id, p1, p2 };
	}

	public async reportMatchWinner(winnerName: string) {
		if (!this.currentMatch) return;
		
		const match: Match | undefined = this.matches.find(m => m.id === this.currentMatch!.id);
		if (match && match.player1 && match.player2) {
			match.winner = match.player1.name === winnerName ? match.player1 : match.player2;
			
			if (this.isRanked) {
				await this.saveMatchResult(match.player1, match.player2, match.winner);
			}

			this.advanceWinnerToNextRound(match);
		}
	}

	private async saveMatchResult(p1: Player, p2: Player, winner: Player) {
        try {
            const scoreP1: number = winner.name === p1.name ? this.winningScore : 0;
            const scoreP2: number = winner.name === p2.name ? this.winningScore : 0;

            const payload = {
                player1Id: p1.id,
                player2Id: p2.id,
                score1: scoreP1,
                score2: scoreP2,
                winnerId: winner.id,
                type: 3
            };

            await sendRequest('POST', '/', payload); 
        } catch (error) {
            console.error("Error while saving tournamente match", error);
        }
    }
}