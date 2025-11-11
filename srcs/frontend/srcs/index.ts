import { PongGame } from './game.js';
import { TournamentController } from './tournament.js';

// --- 1. INTERFACE & CLASS DEFINITIONS ---

interface Route {
  path: string;
  component: () => string | Promise<string>;
}

class Router {
  private routes: Route[] = [];

  addRoute(path: string, component: () => string | Promise<string>) {
    this.routes.push({ path, component });
  }

  navigate(path: string) {
    // Stop any running game *before* navigating
    if (window.location.pathname === '/play') {
        stopCurrentGame();
    }
    history.pushState({}, '', path);
    this.render();
  }

  async render() {
    const currentPath = window.location.pathname;
    const route = this.routes.find(r => r.path === currentPath);

    if (route) {
      const contentDiv = document.getElementById('app');
      if (contentDiv) {
        const html = await route.component();
        contentDiv.innerHTML = html;
      }
    }
    pathActions(currentPath);
  }
}

// --- 2. GLOBAL STATE & INSTANCES ---

var currentGame: PongGame | null = null;
var currentTournament: TournamentController | null = null;
var router: Router = new Router(); // Make router global

// --- 3. HELPER FUNCTIONS ---

function stopCurrentGame() {
  if (currentGame) {
    currentGame.stop();
    currentGame = null;
  }
}

// --- Single Player "Play" button ---
function onClickPlay() {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));
  router.navigate('/play');
}

// --- Tournament "Create Bracket" button ---
function onStartTournament() {
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

  // --- MODIFICATION 1: Read score and pass to constructor ---
  const scoreInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(scoreInput.value, 10);

  // Create and store the new tournament
  currentTournament = new TournamentController(playerNames, winningScore);
  // --- END MODIFICATION ---
  
  router.navigate('/tournament-bracket');
}

// --- Tournament "Play Match" button (from bracket) ---
function startTournamentMatch(matchId: string, p1: string, p2: string) {
  if (currentTournament) {
    currentTournament.startMatch(matchId, p1, p2);
    router.navigate('/play');
  }
}

/**
 * This function runs *after* the HTML for a page is loaded.
 */
function  pathActions(currentPath: string) {
  
  // Logic for the single-player game menu
  if (['/gamemenu'].includes(currentPath)) {
    currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
    const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
    const display = document.getElementById('points-display') as HTMLSpanElement;
    
    if (slider && display) {
      display.innerHTML = slider.value;
      slider.addEventListener('input', () => {
        display.innerHTML = slider.value;
      });
    }
  }

  // Logic for the tournament setup page
  if (currentPath === '/tournament-setup') {
    document.getElementById('start-tournament-btn')?.addEventListener('click', onStartTournament);

    // --- MODIFICATION 2: Add slider logic for tournament setup page ---
    const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
    const display = document.getElementById('points-display') as HTMLSpanElement;
    
    if (slider && display) {
      display.innerHTML = slider.value;
      slider.addEventListener('input', () => {
        display.innerHTML = slider.value;
      });
    }
    // --- END MODIFICATION ---
  }

  // Logic for the tournament bracket page
  if (currentPath === '/tournament-bracket') {
    if (!currentTournament) {
      router.navigate('/tournament-setup'); // No tournament? Go back to setup
      return;
    }
    const bracketContainer = document.getElementById('bracket-container');
    if (bracketContainer) {
      bracketContainer.innerHTML = currentTournament.renderBracket();
    }
  }

  // Logic for the main /play page (handles BOTH game modes)
  if (['/play'].includes(currentPath)) {
    
    // 1. Check if this is a TOURNAMENT match
    if (currentTournament && currentTournament.currentMatch) {
      const match = currentTournament.currentMatch;
      currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
      currentGame.setCtx();

      // --- MODIFICATION 3: Set the winning score for the game ---
      currentGame.setWinningScore(currentTournament.winningScore);
      // --- END MODIFICATION ---

      currentGame.setPlayerNames(match.p1, match.p2); // Set names for the match
      currentGame.start();
    } 
    // 2. Otherwise, it's a SINGLE PLAYER match
    else if (currentGame) {
      currentGame.setCtx();
      currentGame.start();
    }
    // 3. If no game is ready, go back to the menu
    else {
      router.navigate('/gamemenu');
    }
  }
}

// --- 4. HTML TEMPLATES & LOADER ---

const menu = `<nav>
  <a href="/">Home</a> | 
  <a href="/gamemenu">Play</a> |
  <a href="/tournament-setup">Tournament</a> |
  <a href="/settings">Settings</a> |
  <a href="/about">About</a>
</nav>`;

async function loadHtml(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    return `<h1>Error ${response.status}</h1><p>Unable to load ${path}</p>`;
  }
  return await response.text();
}

// --- 5. ROUTES SETUP ---

router.addRoute("/about", async () => {
  const html = await loadHtml("pages/about.html");
  return menu + html;
});

router.addRoute("/settings", async () => {
  const html = await loadHtml("pages/settings.html");
  return menu + html;
});

router.addRoute("/rperrot", async () => {
  const html = await loadHtml("pages/rperrot.html");
  return menu + html;
});

router.addRoute("/gamemenu", async () => {
  const html = await loadHtml("pages/gamemenu.html");
  return menu + html;
});

router.addRoute("/play", async () => {
  const html = await loadHtml("pages/play.html");
  return menu + html;
});

// --- New Tournament Routes ---
router.addRoute("/tournament-setup", async () => {
  const html = await loadHtml("pages/tournament-setup.html");
  return menu + html;
});

router.addRoute("/tournament-bracket", async () => {
  const html = await loadHtml("pages.tournament-bracket.html");
  return menu + html;
});
// --- End New Routes ---

router.addRoute("/", async () => {
  const html = await loadHtml("pages/home.html");
  return menu + html;
});

// Initial page load
router.render();

/* ============================= 6. EVENTS ============================= */

document.addEventListener('click', (e) => {
  const target = e.target as HTMLAnchorElement;
  if (target.tagName === 'A' && target.hasAttribute('href')) {
    e.preventDefault();
    router.navigate(target.getAttribute('href')!);
  }
});

window.addEventListener('popstate', () => {
  router.render();
});


/* ============================= 7. GLOBAL FUNCTIONS ============================= */

// Expose functions to be called by inline HTML (onclick="")
(window as any).onClickPlay = onClickPlay;
(window as any).onStartTournament = onStartTournament;
(window as any).startTournamentMatch = startTournamentMatch;

// Expose main objects for global access (like in PongGame)
(window as any).router = router;
(window as any).currentTournament = currentTournament;