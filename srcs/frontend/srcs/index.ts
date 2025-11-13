import { PongGame } from './tank.js';

interface Route {
  path: string;
  component: () => string | Promise<string>;
}

var currentGame: PongGame | null = null;

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

  if (['/play'].includes(currentPath)) {
    if (!currentGame)
      router.navigate('/gamemenu');
    else {
      currentGame.setCtx();
      currentGame.start();
    }
  }

  if (['/newgame'].includes(currentPath)) {
    // mcurto
    // C'est ici que tu vas mettre ton start de game en mode mygame.start();
    console.log("Loading the new game...");
  }
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

const router = new Router();

const menu = `<nav>
  <a href="/">Home</a> | 
  <a href="/games">Play</a> |
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

router.addRoute("/games", async () => {
  const html = await loadHtml("pages/games.html");
  return menu + html;
});

router.addRoute("/newgame", async () => {
  // mcurto
  // Tu peux créer une page html et faire menu + html comme pour les autres pages
  // Comme ca t'as qu'a fait ton js et ton html
  return menu + `<div class="game-container"><h1>New Super Game !</h1><p>Wow this game is insane !!!</p></div>`;
});

router.addRoute("/", async () => {
  const html = await loadHtml("pages/home.html");
  return menu + html;
});

router.render();

/* ============================= EVENTS ============================= */

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


/* ============================= GLOBAL FUNCTIONS ============================= */

(window as any).onClickPlay = onClickPlay;