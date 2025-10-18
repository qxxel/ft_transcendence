import { PongGame } from './game.js'; // Make sure the path is correct

// Define route interface
interface Route {
  path: string;
  component: () => string | Promise<string>;
}

// This variable will hold the active game instance
var currentGame: PongGame | null = null;

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

function onClickPlay() {
  const maxPointsInput = document.getElementById("choosenMaxPoints") as HTMLInputElement;
  currentGame?.setWinningScore(parseInt(maxPointsInput.value, 10));

  router.navigate('/play');
}

function  pathActions(currentPath: string) {
  if (['/gamemenu'].includes(currentPath)) {
    currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
  }

  if (['/play'].includes(currentPath)) {
    if (!currentGame)
      router.navigate('/gamemenu');
    else {
      currentGame.setCtx();
      currentGame.start();
    }
  }
}

// Define the router class
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
    // stopCurrentGame();

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


// Create the router
const router = new Router();


// Create a menu
const menu = `<nav>
  <a href="/">Home</a> | 
  <a href="/about">About</a> | 
  <a href="/settings">Settings</a> |
  <a href="/gamemenu">Play</a>
</nav>`;


// HTML loader
async function loadHtml(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    return `<h1>Error ${response.status}</h1><p>Unable to load ${path}</p>`;
  }
  return await response.text();
}


// Define routes
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

router.addRoute("/", async () => {
  const html = await loadHtml("pages/home.html");
	return menu + html;
});

router.render();

/* ============================= EVENTS ============================= */

// Handle link clicks
document.addEventListener('click', (e) => {
  const target = e.target as HTMLAnchorElement;
  if (target.tagName === 'A' && target.hasAttribute('href')) {
    e.preventDefault();
    router.navigate(target.getAttribute('href')!);
  }
});

// Handle back/forward navigation
window.addEventListener('popstate', () => {
  router.render();
});


/* ============================= GLOBAL FUNCTIONS ============================= */

// Add onClickPlay function
(window as any).onClickPlay = onClickPlay;