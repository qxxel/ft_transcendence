import { PongGame } from './game.js'; // Make sure the path is correct

interface Route {
  path: string;
  component: () => string | Promise<string>;
}

// This variable will hold the active game instance
let currentGame: PongGame | null = null;

/**
 * Stops the current game if it's running.
 * This is called before navigating to a new page.
 */
function stopCurrentGame() {
  if (currentGame) {
    currentGame.stop();
    currentGame = null;
  }
}

class Router {
  private routes: Route[] = [];

  addRoute(path: string, component: () => string | Promise<string>) {
    this.routes.push({ path, component });
  }

  navigate(path: string) {
    history.pushState({}, '', path);
    this.render();
  }

  async render() {
    stopCurrentGame();

    const currentPath = window.location.pathname;
    const route = this.routes.find(r => r.path === currentPath);

    if (route) {
      const contentDiv = document.getElementById('app');
      if (contentDiv) {
        const html = await route.component();
        contentDiv.innerHTML = html;
      }
    }
    if (['/play', '/localmulti', '/localsolo'].includes(currentPath)) {
      currentGame = new PongGame('pong-canvas', 'score1', 'score2');
      currentGame.start();
    }
  }
}


// 1. Create the router
const router = new Router();


// 1.b. Create a menu
const menu = `<nav>
  <a href="/">Accueil</a> | 
  <a href="/about">À propos</a> | 
  <a href="/settings">Paramètres</a> |
  <a href="/play">Play</a>
</nav>`;

async function loadHtml(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    return `<h1>Erreur ${response.status}</h1><p>Impossible de charger ${path}</p>`;
  }
  return await response.text();
}


// 2. Define routes
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

router.addRoute("/play", async () => {
  const html = await loadHtml("pages/play.html");
  return menu + html;
});

router.addRoute("/localmulti", async () => {
  const html = await loadHtml("pages/localmulti.html");
  return menu + html;
});

router.addRoute("/localsolo", async () => {
  const html = await loadHtml("pages/localsolo.html");
  return menu + html;
});

router.addRoute("/", async () => {
  const html = await loadHtml("pages/home.html");
  return menu + html;
});


// 3. Handle link clicks
document.addEventListener('click', (e) => {
  const target = e.target as HTMLAnchorElement;
  if (target.tagName === 'A' && target.hasAttribute('href')) {
    e.preventDefault();
    router.navigate(target.getAttribute('href')!);
  }
});


// 4. Handle back/forward navigation
window.addEventListener('popstate', () => {
  router.render();
});


// 5. Initial render
router.render();