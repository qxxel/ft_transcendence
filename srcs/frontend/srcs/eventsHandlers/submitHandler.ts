/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   submitHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:08:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 16:53:26 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY SUBMITS


/* ====================== IMPORTS ====================== */

import { User }		from "../user/user.js";
import { router }	from "../index.js";

import type { GameState }		from "../index.js";


/* ====================== FUNCTIONS ====================== */

function	getMenu(username: string | undefined): string {
	return `<nav>
				<a href="/">Home</a> | 
				<a href="/about">About</a> | 
				<a href="/settings">Settings</a> |
				<a href="/user">${username}</a> |
				<button onclick="onClickLogout();" id="logout">Logout</button> |
				<a href="/game-menu">Play</a>
			</nav>`
}

async function	handleSignInForm(form: HTMLFormElement, gameState: GameState, user: User): Promise<void> {
	console.log("Sign in");
	let identifier = (document.getElementById("sign-in-username") as HTMLInputElement).value;
	let password = (document.getElementById("sign-in-password") as HTMLInputElement).value;
	form.reset();

	console.log("identifier: " + identifier);
	console.log("password: " + password);

	console.log(JSON.stringify({ identifier, password }));

	const response: Response = await fetch('/api/auth/sign-in', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ identifier, password })
	});
	
	if (!response.ok)
	{
		const p = document.getElementById("msg-error");
		p!.textContent = response.statusText;
		return ;
	}

	const result = await response.json();

	user.setId(result.id as number);
	user.setUsername(result.username);
	user.setSigned(true);

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(user.getUsername());

	router.navigate("/", gameState, user);
}

async function	handleSignUpForm(form: HTMLFormElement, gameState: GameState, user: User): Promise<void> {
	console.log("Sign up");

	let username = (document.getElementById("sign-up-username") as HTMLInputElement).value;
	let email = (document.getElementById("sign-up-email") as HTMLInputElement).value;
	let password = (document.getElementById("sign-up-password") as HTMLInputElement).value;
	form.reset();

	console.log("username: " + username);
	console.log("email: " + email);
	console.log("password: " + password);
	console.log(JSON.stringify({ username, email, password }));

	const response: Response = await fetch('/api/auth/sign-up', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, email, password })
	});

	let result = null;
	try {
		result = await response.json();
	} catch (error) {}

	if (!response.ok)
	{
		const p = document.getElementById("msg-error");
		console.log("response :", result);
		p!.textContent = result?.error || result?.message || "An unexpected error has occurred";
		return ;
	}
	console.log("response :", result);


	user.setId(result.id as number);
	user.setUsername(username);
	user.setSigned(true);

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(user.getUsername());

	router.navigate("/", gameState, user);
}

export function	setupSubmitHandler(gameState: GameState, user: User): void {
	document.addEventListener('submit', async (event) => {
		event.preventDefault();

		const form = event.target as HTMLFormElement;

		if (form.id === "sign-in-form")
			handleSignInForm(form, gameState, user);

		if (form.id === "sign-up-form")
			handleSignUpForm(form, gameState, user);
	});
}
