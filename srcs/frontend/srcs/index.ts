import { PongGame } from './game.js';
import { TournamentController } from './tournament.js';


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

var currentGame: PongGame | null = null;
var currentTournament: TournamentController | null = null;
var router: Router = new Router();


function stopCurrentGame() {
  if (currentGame) {
    currentGame.stop();
    currentGame = null;
  }
}

function onClickPlay() {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));
  router.navigate('/play');
}

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

  const scoreInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  const winningScore = parseInt(scoreInput.value, 10);

  currentTournament = new TournamentController(playerNames, winningScore);
  
  router.navigate('/tournament-bracket');
}

function startTournamentMatch(matchId: string, p1: string, p2: string) {
  if (currentTournament) {
    currentTournament.startMatch(matchId, p1, p2);
    router.navigate('/play');
  }
}

function  pathActions(currentPath: string) {
  
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

  if (currentPath === '/tournament-setup') {
    document.getElementById('start-tournament-btn')?.addEventListener('click', onStartTournament);

    const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
    const display = document.getElementById('points-display') as HTMLSpanElement;
    
    if (slider && display) {
      display.innerHTML = slider.value;
      slider.addEventListener('input', () => {
        display.innerHTML = slider.value;
      });
    }
  }

  if (currentPath === '/tournament-bracket') {
    if (!currentTournament) {
      router.navigate('/tournament-setup');
      return;
    }
    const bracketContainer = document.getElementById('bracket-container');
    if (bracketContainer) {
      bracketContainer.innerHTML = currentTournament.renderBracket();
    }
  }

  if (['/play'].includes(currentPath)) {
    
    if (currentTournament && currentTournament.currentMatch) {
      const match = currentTournament.currentMatch;
      currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
      currentGame.setCtx();

      currentGame.setWinningScore(currentTournament.winningScore);

      currentGame.setPlayerNames(match.p1, match.p2);
      currentGame.start();
    } 
    else if (currentGame) {
      currentGame.setCtx();
      currentGame.start();
    }
    else {
      router.navigate('/gamemenu');
    }
  }
}


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

router.addRoute("/tournament-setup", async () => {
  const html = await loadHtml("pages/tournament-setup.html");
  return menu + html;
});

router.addRoute("/tournament-bracket", async () => {
  const html = await loadHtml("pages/tournament-bracket.html");
  return menu + html;
});

router.addRoute("/", async () => {
  const html = await loadHtml("pages/home.html");
  return menu + html;
});

router.render();

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

(window as any).onClickPlay = onClickPlay;
(window as any).onStartTournament = onStartTournament;
(window as any).startTournamentMatch = startTournamentMatch;

(window as any).router = router;
(window as any).currentTournament = currentTournament;