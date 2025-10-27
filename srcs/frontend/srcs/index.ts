import { PongGame } from './game.js'; // Make sure the path is correct
// import { UserService } from './user.js'; // Make sure the path is correct
import { User } from './user.js'; // Make sure the path is correct

// Define route interface
interface Route {
  path: string;
  component: () => string | Promise<string>;
}

// This variable will hold the active game instance
var currentGame: PongGame | null = null;

// This variable will hold the active user infos
var user = new User();

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



async function getMessage() {
  const res = await fetch('http://localhost:9090/api/hello');
  const data = await res.json();
  console.log(data); // { message: 'Hello depuis Fastify !' }
}



function  pathActions(currentPath: string) {
  if (['/game-menu'].includes(currentPath)) {
    currentGame = new PongGame('pong-canvas', 'score1', 'score2', 'winning-points');
  }

  if (['/play'].includes(currentPath)) {
    if (!currentGame)
      router.navigate('/game-menu');
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
var menu = `<nav>
  <a href="/">Home</a> | 
  <a href="/about">About</a> | 
  <a href="/settings">Settings</a> |
  <a href="/sign-in">Sign in</a> |
  <a href="/sign-up">Sign up</a> |
  <a href="/user">User</a> |
  <a href="/game-menu">Play</a>
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

router.addRoute("/user", async () => {
	const html = await loadHtml("pages/user.html");
	return menu + html;
});

router.addRoute("/sign-in", async () => {
	const html = await loadHtml("pages/sign-in.html");
	return menu + html;
});

router.addRoute("/sign-up", async () => {
	const html = await loadHtml("pages/sign-up.html");
	return menu + html;
});

router.addRoute("/rperrot", async () => {
	const html = await loadHtml("pages/rperrot.html");
	return menu + html;
});

router.addRoute("/game-menu", async () => {
	const html = await loadHtml("pages/game-menu.html");
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
document.addEventListener('click', (event) => {
  const target = event.target as HTMLAnchorElement;
  if (target.tagName === 'A' && target.hasAttribute('href')) {
    event.preventDefault();
    router.navigate(target.getAttribute('href')!);
  }
});

// Handle submit
document.addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement;

  if (form.id === "sign-in-form")
  {
    console.log("Sign in");
    let username = (document.getElementById("sign-in-username") as HTMLInputElement).value;
    let password = (document.getElementById("sign-in-password") as HTMLInputElement).value;
    form.reset();

    console.log("username: " + username);
    console.log("password: " + password);
  }

  if (form.id === "sign-up-form")
  {
    console.log("Sign up");
    let username = (document.getElementById("sign-up-username") as HTMLInputElement).value;
    let password = (document.getElementById("sign-up-password") as HTMLInputElement).value;
    form.reset();

    user.setUsername(username);
    user.setSigned(true);
    console.log("username: " + username);
    console.log("password: " + password);

    menu = `<nav>
              <a href="/">Home</a> | 
              <a href="/about">About</a> | 
              <a href="/settings">Settings</a> |
              <a href="/user">${user.getUsername()}</a> |
              <a href="/game-menu">Play</a>
            </nav>`;
  }
});

// Handle back/forward navigation
window.addEventListener('popstate', () => {
  router.render();
});


/* ============================= GLOBAL FUNCTIONS ============================= */

// Add onClickPlay function
(window as any).onClickPlay = onClickPlay;


(window as any).getMessage = getMessage;
