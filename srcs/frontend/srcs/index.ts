// function greeter(person) {
//   return "Hello, " + person;
// }
 
// let user = "Jane User";
 
// document.body.textContent = greeter(user);

// console.log("Le front tourne !");

// const canvas = document.createElement("canvas");
// canvas.width = 400;
// canvas.height = 400;
// document.body.appendChild(canvas);

// const ctx = canvas.getContext("2d");
// if (ctx) {
//   ctx.fillStyle = "blue";
//   ctx.fillRect(50, 50, 100, 100);

//   ctx.fillStyle = "red";
//   ctx.beginPath();
//   ctx.arc(200, 200, 50, 0, Math.PI * 2);
//   ctx.fill();
// }


interface	Route {
	path: string;
	component: () => string;
}

class Router {
	private routes: Route [] = [];

	addRoute(path: string, component: () => string) {
		this.routes.push({path, component});
	}

	navigate(path: string) {
		history.pushState({}, '', path);
    	this.render();
	}

	render() {
		const currentPath = window.location.pathname;
		const route = this.routes.find(r => r.path === currentPath);

		if (route) {
			const contentDiv = document.getElementById('app');
      		if (contentDiv) {
        		contentDiv.innerHTML = route.component();
			}
		}
	}
}

// 1. Création du router
const router = new Router();

// 1.bis Creer un menu
const menu = `<nav><a href="/home">Accueil</a> | <a href="/about">À propos</a> | <a href="/settings">Paramètres</a></nav>`;

// 2. Définition des routes
router.addRoute("/home", () => `${menu}<h1>Accueil</h1><p>Bienvenue !</p>`);
router.addRoute("/about", () => `${menu}<h1>À propos</h1><p>Notre histoire...1</p><a href=\"/rperrot\">rperrot</a>`);
router.addRoute("/settings", () => `${menu}<h1>Parametres</h1><p>Name</p><p>Nickname</p>`);
router.addRoute("/rperrot", () => `${menu}<h1>Le triathlete</h1><p>Il est trop nul en nage !</p>`);
router.addRoute("/", () => `${menu}<h1>Page d'accueil</h1><p>Choisissez une section</p>`);


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