// Define interfaces (assuming these are here or in another file)
interface Player {
  name: string;
}

interface Match {
  id: string;
  round: number;
  player1: Player | null;
  player2: Player | null;
  winner: Player | null;
  nextMatchId: string | null;
}

export class TournamentController {
  public players: Player[] = [];
  public matches: Match[] = [];
  public currentMatch: { id: string; p1: string; p2: string } | null = null;
  public winningScore: number = 5; // Default value

  /**
   * --- MODIFIED CONSTRUCTOR ---
   * Now accepts 'winningScore' from the setup page.
   */
  constructor(playerNames: string[], winningScore: number) {
    this.players = playerNames.map(name => ({ name }));
    this.winningScore = winningScore; // Store the winning score
    this.generateBracket();
  }

  private generateBracket() {
    const numPlayers = this.players.length;
    
    // Shuffle players for a random bracket
    const shuffledPlayers = [...this.players].sort(() => Math.random() - 0.5);
    
    let round = 1;
    let matchNum = 1;
    
    // Create Round 1
    for (let i = 0; i < numPlayers; i += 2) {
      const player1 = shuffledPlayers[i];
      const player2 = (i + 1 < numPlayers) ? shuffledPlayers[i+1] : null;

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

  // Get the HTML for the bracket
  public renderBracket(): string {
    let html = '<div class="round">';
    
    for (const match of this.matches) {
      const p1Name = match.player1?.name || 'TBD';
      const p2Name = match.player2?.name || 'BYE';
      
      const p1Class = match.winner === match.player1 ? 'winner' : '';
      const p2Class = match.winner === match.player2 ? 'winner' : '';
      
      let button = '';
      if (!match.winner && match.player1 && match.player2) {
        button = `<button class="btn-play-match" onclick="window.startTournamentMatch('${match.id}', '${p1Name}', '${p2Name}')">Play</button>`;
      }
      
      html += `
        <div class="match" id="${match.id}">
          <div class="player ${p1Class}">${p1Name}</div>
          <div class="player ${p2Class}">${p2Name}</div>
          ${button}
        </div>
      `;
    }
    html += '</div>';
    return html;
  }

  // Called when user clicks "Play" on a match
  public startMatch(id: string, p1: string, p2: string) {
    this.currentMatch = { id, p1, p2 };
  }

  // Called from PongGame when a winner is decided
  public reportMatchWinner(winnerName: string) {
    if (!this.currentMatch) return;
    
    const match = this.matches.find(m => m.id === this.currentMatch!.id);
    if (match) {
      match.winner = match.player1?.name === winnerName ? match.player1 : match.player2;
      console.log(`Match ${match.id} won by ${winnerName}`);
    }
  }
}