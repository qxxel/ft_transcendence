interface	Route {
	path: string;
	component: () => string | Promise<string>;
}

class Router {
	private routes: Route [] = [];

	addRoute(path: string, component: () => string | Promise<string>) {
		this.routes.push({path, component});
	}

	navigate(path: string) {
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
	}
}

// 1. Création du router
const router = new Router();

// 1.bis Creer un menu
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


	// 2. Définition des routes
	// router.addRoute("/about", () => `${menu}`);
router.addRoute("/about", async () => {
  const html = await loadHtml("pages/about.html");
  return menu + html;
});
// router.addRoute("/settings", () => `${menu}<h1>Settings</h1><p class="name">Name</p><p class="name">Nickname</p>`);
router.addRoute("/settings", async () => {
  const html = await loadHtml("pages/settings.html");
  return menu + html;
});
// router.addRoute("/rperrot", () => `${menu}<h1>The triathlete</h1><p>He's so bad at swiming !</p>`);
router.addRoute("/rperrot", async () => {
  const html = await loadHtml("pages/rperrot.html");
  return menu + html;
});
// router.addRoute("/play", () => `${menu}<h1>Play</h1><a href=\"/localsolo\" class="txt">local solo</a> | <a href=\"/localmulti\" class="txt">local multiplayer</a>`);
router.addRoute("/play", async () => {
  const html = await loadHtml("pages/play.html");
  return menu + html;
});
// router.addRoute("/localmulti", () => `${menu}<h1>Local Multiplayer</h1>`);
router.addRoute("/localmulti", async () => {
  const html = await loadHtml("pages/localmulti.html");
  return menu + html;
});
// router.addRoute("/localsolo", () => `${menu}<h1>Local Solo</h1>`);
router.addRoute("/localsolo", async () => {
  const html = await loadHtml("pages/localsolo.html");
  return menu + html;
});
// router.addRoute("/", () => `${menu}<h1>Home pge</h1><a href="/play" class="txt">Play</a>`);
// route racine "/"
router.addRoute("/", async () => {
  const html = await loadHtml("pages/home.html");
  return menu + html;
});


// 3. QUAND la page change ? Quand on clique sur un lien !
document.addEventListener('click', (e) => {
  const target = e.target as HTMLAnchorElement;
  if (target.tagName === 'A') {
    e.preventDefault(); // Empêche le rechargement de page
    router.navigate(target.getAttribute('href')!); // ← ICI la page change !
  }
});

// 4. Gérer le bouton "retour" du navigateur
window.addEventListener('popstate', () => {
  router.render(); // Re-dessiner la page
});

// 5. Afficher la page initiale
router.render();