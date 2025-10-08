interface Route {
  path: string;
  component: () => string | Promise<string>;
}

function removePlayer() {
  const existingPlayer = document.getElementById('player');
  if (existingPlayer) {
    existingPlayer.remove();
  }
  window.removeEventListener('keydown', movePlayerHandler);
}

let player: HTMLDivElement | null = null;
let posX = 200;
let posY = 200;
const step = 10;

function movePlayerHandler(e: KeyboardEvent) {
  if (!player) return;
  switch (e.key) {
    case 'ArrowUp':
    case 'z': // Z key (forward)
    case 'Z':
      posY -= step;
      break;

    case 'ArrowDown':
    case 's': // S key (backward)
    case 'S':
      posY += step;
      break;

    case 'ArrowLeft':
    case 'q': // Q key (left)
    case 'Q':
      posX -= step;
      break;

    case 'ArrowRight':
    case 'd': // D key (right)
    case 'D':
      posX += step;
      break;
  }
  player.style.top = `${posY}px`;
  player.style.left = `${posX}px`;
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
    // Remove player on each page change
    removePlayer();

    const currentPath = window.location.pathname;
    const route = this.routes.find(r => r.path === currentPath);

    if (route) {
      const contentDiv = document.getElementById('app');
      if (contentDiv) {
        const html = await route.component();
        contentDiv.innerHTML = html;
      }
    }

    // Create the player only for /play
    if (currentPath === '/play') {
      player = document.createElement('div');
      player.id = 'player';
      player.style.width = '50px';
      player.style.height = '50px';
      player.style.backgroundColor = 'red';
      player.style.position = 'absolute';
      player.style.top = '200px';
      player.style.left = '200px';
      document.body.appendChild(player);

      posX = 200;
      posY = 200;
      window.addEventListener('keydown', movePlayerHandler);
    }
  }
}


// 1. Create the router
const router = new Router();


// 1.b. Create a menu
const menu = `<nav>
  <a href="/">Accueil</a> | 
  <a href="/about">À propos</a> | 
  <a href="/settings">Paramètres</a>
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
  if (target.tagName === 'A') {
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