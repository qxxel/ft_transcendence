/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:38:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 17:40:25 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// /!\ DESCRIBE THE FILE /!\


/* ============================= INTERFACES ============================= */

interface	Player {
	name: string;
}

interface	Match {
	id: string;
	round: number;
	player1: Player | null;
	player2: Player | null;
	winner: Player | null;
	nextMatchId: string | null;
}


/* ============================= CLASS ============================= */

export class	TournamentController {
	public	players: Player[] = [];
	public	matches: Match[] = [];
	public	currentMatch: { id: string; p1: string; p2: string } | null = null;
	public	winningScore: number = 5;

	constructor(playerNames: string[], winningScore: number) {
		this.players = playerNames.map(name => ({ name }));
		this.winningScore = winningScore;
		this.generateBracket();
	}

	// private	generateBracket() {
	//   const numPlayers = this.players.length;
		
	//   const shuffledPlayers = [...this.players].sort(() => Math.random() - 0.5);
		
	//   // Rounds: players == 4 -> 2; players <= 8 -> 3; players <= 16 -> 4
	//   // Nombres de 1v1 premier Round: players < 8 -> 8 - numPlayers; players < 16 - numPlayers
	//   let roundTot = 4;
	//   let firstRound = 8;
	//   if (numPlayers < 16){
	//     firstRound = 16 - numPlayers;
	//     if (numPlayers <= 8){
	//       firstRound = 8 - numPlayers;
	//       roundTot = 3;
	//       if (numPlayers == 4){
	//         firstRound = 2;
	//         roundTot = 2;
	//       }
	//     }
	//   }
			

	//   let round = 1;
	//   while (round <= roundTot){
	//     let matchNum = 1;
	//     for (let i = 0; i < numPlayers && firstRound; i += 2) {
	//       const player1 = shuffledPlayers[i];
	//       const player2 = (i + 1 < numPlayers) ? shuffledPlayers[i+1] : null;
	
	
	//       const match: Match = {
	//         id: `r${round}-m${matchNum}`,
	//         round: round,
	//         player1: player1,
	//         player2: player2,
	//         winner: player2 === null ? player1 : null,
	//         nextMatchId: null 
	//       };
				
	//       this.matches.push(match);
	//       matchNum++;
	//       if (round == 1)
	//         firstRound--;
	//     }
	//     round++;
	//     firstRound = 1;
	//   }
	// }

	private	generateBracket(): void {
		const numPlayers = this.players.length;
		const shuffledPlayers = [...this.players].sort(() => Math.random() - 0.5);
		
		let round = 1;
		let matchNum = 1;
		
		for (let i = 0; i < numPlayers; i += 2) {
			const player1 = shuffledPlayers[i]!;
			const player2 = (i + 1 < numPlayers) ? shuffledPlayers[i+1]! : null;

			const match: Match = {
				id: `r${round}-m${matchNum}`,
				round: round,
				player1: player1,
				player2: player2,
				winner: player2 === null ? player1 : null, // Player 1 wins by 'bye'
				nextMatchId: null 
			};
			
			this.matches.push(match);
			matchNum++;
		}
	}

	public	renderBracket(): string {
		let html = '<div class="round">';
		
		for (const match of this.matches) {
			const p1Name = match.player1?.name || 'TBD';
			const p2Name = match.player2?.name || 'BYE';
			
			const p1class	= match.winner === match.player1 ? 'winner' : '';
			const p2class	= match.winner === match.player2 ? 'winner' : '';
			
			let button: string = '';
			if (!match.winner && match.player1 && match.player2) {
				button = `<button class="btn-play-match" onclick="window.startTournamentMatch('${match.id}', '${p1Name}', '${p2Name}')">Play</button>`;
			}
			
			html += `
				<div class="match" id="${match.id}">
					<div class="player ${p1class}">${p1Name}</div>
					<div class="player ${p2class}">${p2Name}</div>
					${button}
				</div>
			`;
		}
		html += '</div>';
		return html;
	}

	public	startMatch(id: string, p1: string, p2: string) {
		this.currentMatch = { id, p1, p2 };
	}

	public	reportMatchWinner(winnerName: string) {
		if (!this.currentMatch) return;
		
		const match = this.matches.find(m => m.id === this.currentMatch!.id);
		if (match) {
			match.winner = match.player1?.name === winnerName ? match.player1 : match.player2;
			console.log(`Match ${match.id} won by ${winnerName}`);
		}
	}
}