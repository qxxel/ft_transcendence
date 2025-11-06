/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   submitHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:08:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/06 11:34:11 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== IMPORTS ====================== */

import { User } from "../user/user.js";
import { router } from "../index.js";
import { PongGame } from "../game/game.js";


/* ====================== FUNCTIONS ====================== */


async function	handleSignInForm(form: HTMLFormElement, currentGame: PongGame | null, user: User): Promise<void> {
	console.log("Sign in");
	let identifier = (document.getElementById("sign-in-username") as HTMLInputElement).value;
	let password = (document.getElementById("sign-in-password") as HTMLInputElement).value;
	form.reset();

	console.log("identifier: " + identifier);
	console.log("password: " + password);

	console.log(JSON.stringify({ identifier, password }));

	const response: Response = await fetch('/api/user/sign-in', {
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ identifier, password })
	});
	const result = await response.json();

	user.setId(result.id as number);
	user.setUsername(result.username);
	user.setSigned(true);

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML =
			`<nav>
				<a href="/">Home</a> | 
				<a href="/about">About</a> | 
				<a href="/settings">Settings</a> |
				<a href="/user">${user.getUsername()}</a> |
				<button onclick="onClickLogout();" id="logout">Logout</button> |
				<a href="/game-menu">Play</a>
			</nav>`;

	router.navigate("/", currentGame, user);
}

async function	handleSignUpForm(form: HTMLFormElement, currentGame: PongGame | null, user: User): Promise<void> {
	console.log("Sign up");

	let username = (document.getElementById("sign-up-username") as HTMLInputElement).value;
	let email = (document.getElementById("sign-up-email") as HTMLInputElement).value;
	let password = (document.getElementById("sign-up-password") as HTMLInputElement).value;
	form.reset();

	console.log("username: " + username);
	console.log("email: " + email);
	console.log("password: " + password);
	console.log(JSON.stringify({ username, email, password }));
	const response: Response = await fetch('/api/user/sign-up', {
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, email, password })
	});

	const result = await response.json();

	user.setId(result.id as number);
	user.setUsername(username);
	user.setSigned(true);

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML =
			`<nav>
				<a href="/">Home</a> | 
				<a href="/about">About</a> | 
				<a href="/settings">Settings</a> |
				<a href="/user">${user.getUsername()}</a> |
				<button onclick="onClickLogout();" id="logout">Logout</button> |
				<a href="/game-menu">Play</a>
			</nav>`;

	router.navigate("/", currentGame, user);
}

export function	setupSubmitHandler(currentGame: PongGame | null, user: User): void {
	document.addEventListener('submit', async (event) => {
		event.preventDefault();

		const form = event.target as HTMLFormElement;

		if (form.id === "sign-in-form")
			handleSignInForm(form, currentGame, user);

		if (form.id === "sign-up-form")
			handleSignUpForm(form, currentGame, user);
	});
}
