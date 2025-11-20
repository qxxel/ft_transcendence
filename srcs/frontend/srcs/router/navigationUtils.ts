/* ************************************************************************** */
/* navigationUtils.ts                                                       */
/* ************************************************************************** */

// ALL UTILS TO NAVIGATION ARE LOCATED HERE

/* ====================== IMPORTS ====================== */

import { PongGame } from "../Pong/Pong.js";
import { router }   from "../index.js";
import { TankGame } from "../v3/tank.js";
import { User }     from "../user/user.js";

import type { GameState }   from "../index.js"


/* ====================== FUNCTION ====================== */

export function  pathActions(currentPath: string, gameState: GameState, user: User): void {
    
    if (!['/pong', '/tank'].includes(currentPath)) {
        if (gameState.currentGame) 
            gameState.currentGame.stop();
    }

    if (['/pong'].includes(currentPath)) {
        
       if (gameState.currentTournament && gameState.currentTournament.currentMatch) {
            const match = gameState.currentTournament.currentMatch;
            
            const tournamentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);
            
            tournamentGame.setCtx();
            
            tournamentGame.setWinningScore(gameState.currentTournament.winningScore);
            tournamentGame.setPlayerNames(match.p1, match.p2);
            
            tournamentGame.start();

            gameState.currentGame = tournamentGame;
        }
        
        else if (gameState.currentGame) {
            gameState.currentGame.setCtx();
            gameState.currentGame.start();
        }
        
        else {
            router.navigate("/pongmenu", gameState, user);
        }
    }

    if (['/sign-in', '/sign-up'].includes(currentPath)) {
        if (user.isSignedIn())
            router.navigate("/", gameState, user);
    }

    if (['/pongmenu'].includes(currentPath)) {
        gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user);
        
        const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
        const display = document.getElementById('points-display') as HTMLSpanElement;
        
        if (slider && display) {
          display.innerHTML = slider.value;
          slider.addEventListener('input', () => {
            display.innerHTML = slider.value;
          });
        }
    }

    if (['/tournament-setup'].includes(currentPath)) {
        const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
        const display = document.getElementById('points-display') as HTMLSpanElement;
        
        if (slider && display) {
          display.innerHTML = slider.value;
          slider.addEventListener('input', () => {
            display.innerHTML = slider.value;
          });
        }
    }

    if (['/tournament-bracket'].includes(currentPath)) {
        if (!gameState.currentTournament) {
            router.navigate("/tournament-setup", gameState, user);
            return;
        }

        const container = document.getElementById('bracket-container');
        if (container) {
            container.innerHTML = gameState.currentTournament.renderBracket();
        }
    }

    if (['/tank'].includes(currentPath)) {
        gameState.currentGame = new TankGame('pong-canvas', 'desertfox', 4);
        gameState.currentGame.start();
        console.log("Loading the new game...");
    }
}