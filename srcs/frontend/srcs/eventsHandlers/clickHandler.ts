/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   clickHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:40:38 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/27 15:37:13 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY CLICKS

/* ====================== IMPORTS ====================== */

import { PongGame } from "../Pong/Pong.js";
import { TournamentController } from "../tournament.js";
import { Router }       from "../router/router.js"
import { sendRequest }  from "../utils/sendRequest.js"
import { User }         from "../user/user.js"

import type { GameState }   from "../index.js"


/* ====================== FUNCTIONS ====================== */

function onClickPlay(router: Router, gameState: GameState, user: User): void {
    const   maxPointsInput: HTMLInputElement = document.getElementById("choosenMaxPoints") as HTMLInputElement;
    gameState.currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

    router.navigate("/pong", gameState, user);
}

async function  onClickLogout(router: Router, gameState: GameState, user: User): Promise<void> {
    const   response: Response = await sendRequest('/api/jwt/refresh/logout', 'DELETE', null);

    if (!response.ok)
        throw new Error('Logout failed');

    user.logout();

    var menu: HTMLElement = document.getElementById("nav") as HTMLElement;
    if (menu)
        menu.innerHTML =
            `<a href="/">Home</a>
            <a href="/games">Play</a>
            <a href="/tournament-setup">Tournament</a>
            <a href="/user">${user.getUsername()}</a>
            <button onclick="onClickLogout();" id="logout">Logout</button>
            <a href="/settings">Settings</a>
            <a href="/about">About</a>`;

    router.navigate("/", gameState, user);
}

async function onClickGetMessage(): Promise<void> {
    const   res: Response = await fetch('/api/jwt', {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
    });

    const   data: unknown = await res.json();
    console.log(data);
}

async function onClickValidateMessage(): Promise<void> {
    const   res: Response = await fetch('/api/jwt/validate', {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
    });

    const   data: unknown = await res.json();
    console.log(data);
}

async function onClickRefreshMessage(): Promise<void> {
    const   res: Response = await fetch('/api/jwt/refresh', {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: 1, username: "mreynaud", email: "mreynaud@42.fr" })
    });

    const   data: unknown = await res.json();
    console.log(data);
}


/* ====================== UI TOGGLE HELPERS ====================== */

function showDifficultyMenu() {
    const mainBtns = document.getElementById('main-menu-btns');
    const diffBtns = document.getElementById('difficulty-btns');
    
    if (mainBtns && diffBtns) {
        mainBtns.classList.add('hidden');
        diffBtns.classList.remove('hidden');
    }
}

function hideDifficultyMenu() {
    const mainBtns = document.getElementById('main-menu-btns');
    const diffBtns = document.getElementById('difficulty-btns');
    
    if (mainBtns && diffBtns) {
        mainBtns.classList.remove('hidden');
        diffBtns.classList.add('hidden');
    }
}

function switchGameMode(mode: 'default' | 'featured') {
    const defDiv = document.getElementById('default-mode-content');
    const featDiv = document.getElementById('featured-mode-content');

    if (mode === 'default') {
        defDiv?.classList.remove('hidden');
        featDiv?.classList.add('hidden');
    } else {
        defDiv?.classList.add('hidden');
        featDiv?.classList.remove('hidden');
    }
}

function selectFeaturedDifficulty(level: number) {
    const input = document.getElementById('aiHardcore') as HTMLInputElement;
    if (input) {
        input.value = level.toString();
    }

    for (let i = 1; i <= 4; i++) {
        document.getElementById(`btn-feat-${i}`)?.classList.remove('active');
    }

    document.getElementById(`btn-feat-${level}`)?.classList.add('active');
}

/* ====================== GAME & TOURNAMENT HANDLERS ====================== */

function onClickPlayAI(difficulty: 'easy' | 'medium' | 'hard', router: Router, gameState: GameState, user: User) {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(maxPointsInput.value, 10);
  
  gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user, 'ai', difficulty);
  gameState.currentGame.setWinningScore(winningScore);
  
  router.navigate("/pong", gameState, user);
}

function onClickPlayPVP(router: Router, gameState: GameState, user: User) {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(maxPointsInput.value, 10);
  
  gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user, 'pvp');
  gameState.currentGame.setWinningScore(winningScore);
  
  router.navigate("/pong", gameState, user);
}

function onStartTournament(router: Router, gameState: GameState, user: User) {
  const inputs = document.querySelectorAll('.player-name-input') as NodeListOf<HTMLInputElement>;
  const playerNames: string[] = [];
  
  inputs.forEach(input => {
    if (input.value.trim() !== '') {
      playerNames.push(input.value.trim());
    }
  });

  if (playerNames.length < 4) {
    alert("You need at least 4 players to start a tournament.");
    return;
  }

  const scoreInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(scoreInput.value, 10);

  gameState.currentTournament = new TournamentController(playerNames, winningScore);
  
  router.navigate("/tournament-bracket", gameState, user);
}

function startTournamentMatch(matchId: string, p1: string, p2: string, router: Router, gameState: GameState, user: User) {
  if (gameState.currentTournament) {
    gameState.currentTournament.startMatch(matchId, p1, p2);
    router.navigate('/pong', gameState, user);
  }
}

function onClickStartFeatured(router: Router, gameState: GameState, user: User) {
    const freqInput = document.getElementById("powerupFreq") as HTMLInputElement;
    const aiInput = document.getElementById("aiHardcore") as HTMLInputElement;

    const pointsInput = document.getElementById("featuredMaxPoints") as HTMLInputElement;
    const winningScore = parseInt(pointsInput.value, 10);
    
    const star1 = (document.getElementById("chk-1star") as HTMLInputElement).checked;
    const star2 = (document.getElementById("chk-2star") as HTMLInputElement).checked;
    const star3 = (document.getElementById("chk-3star") as HTMLInputElement).checked;

    const aiVal = parseInt(aiInput.value);
    let difficulty: any = 'medium'; 
    if (aiVal === 1) difficulty = 'easy';
    if (aiVal === 3) difficulty = 'hard';
    if (aiVal === 4) difficulty = 'boris';

    console.log(`Starting Featured: Freq=${freqInput.value}, Diff=${difficulty}, Stars=[${star1},${star2},${star3}]`);

    gameState.currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points', router, gameState, user, 'ai', difficulty, star1, star2, star3);
    
    gameState.currentGame.setWinningScore(winningScore);

    router.navigate("/pong", gameState, user);
}

/* ====================== SETUP ====================== */

export async function   setupClickHandlers(router: Router, user: User, gameState: GameState): Promise<void> {
    (window as any).onClickPlay = () => onClickPlay(router, gameState, user);
    (window as any).onClickLogout = () => onClickLogout(router, gameState, user);
    (window as any).onClickGetMessage = onClickGetMessage;
    (window as any).onClickValidateMessage = onClickValidateMessage;
    (window as any).onClickRefreshMessage = onClickRefreshMessage;
    
    (window as any).showDifficultyMenu = showDifficultyMenu;
    (window as any).hideDifficultyMenu = hideDifficultyMenu;

    (window as any).switchGameMode = switchGameMode;
    (window as any).onClickStartFeatured = () => onClickStartFeatured(router, gameState, user);
    (window as any).selectFeaturedDifficulty = selectFeaturedDifficulty;

    (window as any).onClickPlayAI = (difficulty: 'easy' | 'medium' | 'hard') => 
        onClickPlayAI(difficulty, router, gameState, user);

    (window as any).onClickPlayPVP = () => onClickPlayPVP(router, gameState, user);
    (window as any).onStartTournament = () => onStartTournament(router, gameState, user);
    
    (window as any).startTournamentMatch = (matchId: string, p1: string, p2: string) => 
        startTournamentMatch(matchId, p1, p2, router, gameState, user);
    
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLAnchorElement;
        if (target.tagName === 'A' && target.hasAttribute('href')) {
            event.preventDefault();
            console.log(target.getAttribute('href')!);
            router.navigate(target.getAttribute('href')!, gameState, user);
        }
    });

    document.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        if (!target) return;

        if (target.id === 'choosenMaxPoints') {
            const display = document.getElementById('points-display');
            if (display) {
                display.innerText = target.value;
            }
        }
        
        if (target.id === 'powerupFreq') {
            const display = document.getElementById('powerup-freq-display');
            if (display) {
                display.innerText = target.value + " sec";
            }
        }

        if (target.id === 'featuredMaxPoints') {
            const display = document.getElementById('featured-points-display');
            if (display) {
                display.innerText = target.value;
            }
        }
    });

    window.addEventListener('popstate', () => {
        router.render(gameState, user);
    });
}