/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/07 13:58:03 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/09 14:41:49 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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

/* ========================================================== */

const router = new Router();

const menu = `<nav>
	<a href="/">Accueil</a> | 
	<a href="/about">À propos</a> | 
	<a href="/settings">Paramètres</a>
	</nav>`;

/* ========================================================== */

async function loadHtml(path: string) {
	const response = await fetch(path);
	if (!response.ok) {
		return `<h1>Erreur ${response.status}</h1><p>Impossible de charger ${path}</p>`;
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

/* ========================================================== */

document.addEventListener('click', (e) => {
	// const target = e.target as HTMLAnchorElement;
	const target = e.target as HTMLElement;
	
	if (target.tagName === 'A') {
		e.preventDefault();
		router.navigate(target.getAttribute('href')!); // Changement de page
	}

	
});


window.addEventListener('popstate', () => {
	router.render();
});

router.render();
