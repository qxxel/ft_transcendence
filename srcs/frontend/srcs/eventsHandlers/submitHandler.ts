/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   submitHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:08:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/01 22:06:20 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY SUBMITS


/* ====================== IMPORTS ====================== */

import { router }	from "../index.js"
import { User }		from "../user/user.js"
import { sendRequest }	from "../utils/sendRequest.js"
import { displayDate }	from "../utils/displayDate.js"
import { getAndRenderFriends }	from "../friends/getAndRenderFriends.js"

import type { GameState }	from "../index.js"


/* ====================== FUNCTIONS ====================== */

function	getMenu(username: string | undefined): string {
	return `<a href="/">Home</a>
				<a href="/games">Play</a>
				<a href="/tournament-setup">Tournament</a>
				<a href="/user">${username}</a>
				<button onclick="onClickLogout();" id="logout">Logout</button>
				<a href="/settings">Settings</a>
				<a href="/about">About</a>`;
}

async function	handleSignInForm(form: HTMLFormElement, gameState: GameState, user: User): Promise<void> {
	console.log("Sign in");
	const	identifier: string = (document.getElementById("sign-in-username") as HTMLInputElement).value;
	const	password: string = (document.getElementById("sign-in-password") as HTMLInputElement).value;
	form.reset();

	console.log("identifier: " + identifier);
	console.log("password: " + password);

	console.log(JSON.stringify({ identifier, password }));

	const	response: Response = await fetch('/api/auth/sign-in', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ identifier, password })
	});

	const	result: any = await response.json();

	if (!response.ok) {
		const	p: HTMLElement | null = document.getElementById("sign-in-msg-error");
		if (!p)
			console.error("No HTMLElement named \`msg-error\`.");
		else
			p.textContent = result?.error || "An unexpected error has occurred";
		return ;
	}

	user.setId(result.id as number);
	user.setUsername(result.username);

	if (result.is2faEnable) {
		router.navigate("/2fa", gameState, user);
		
		sendRequest('/api/twofa/otp', 'GET', null)
			.then((response) => {
				if (!response.ok)
					console.log(response.statusText)
			});
		
		return ;
	}
	user.setSigned(true);

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(user.getUsername());

	router.navigate("/", gameState, user);
}

async function	handleSignUpForm(form: HTMLFormElement, gameState: GameState, user: User): Promise<void> {
	console.log("Sign up");

	const	username: string = (document.getElementById("sign-up-username") as HTMLInputElement).value;
	const	email: string = (document.getElementById("sign-up-email") as HTMLInputElement).value;
	const	password: string = (document.getElementById("sign-up-password") as HTMLInputElement).value;
	form.reset();

	const	response: Response = await fetch('/api/auth/sign-up', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, email, password })
	});

	const	result = await response.json();

	if (!response.ok) {
		const	p = document.getElementById("sign-up-msg-error");
		if (!p)
			console.error("No HTMLElement named \`msg-error\`.");
		else
			p.textContent = result?.error || "An unexpected error has occurred";
		return ;
	}

	user.setId(result.id as number);
	user.setUsername(username);

	const	divSignUp = document.getElementById("sign-up");
	if (divSignUp)
		divSignUp.hidden = true;

	const	divVerifyEmail = document.getElementById("verify-email");
	if (divVerifyEmail)
		divVerifyEmail.hidden = false;

	router.canLeave = false;

	sendRequest('/api/twofa/otp', 'GET', null)
		.then(async (res) => {
			if (!res.ok) {
				const	p = document.getElementById("verify-email-msg-error");
				if (!p)
					console.error("No HTMLElement named \`msg-error\`.");
				else {
					const	resJson = await res.json();
					p.textContent = resJson?.error || "An unexpected error has occurred";
				}
				return ;
			}
		});
	displayDate(5);
}

async function	handleVerifyEmailForm(form: HTMLFormElement, gameState: GameState, user: User): Promise<void> {
	console.log("VerifyEmail");

	const	otp: string = (document.getElementById("digit-code") as HTMLInputElement).value;
	form.reset();
	
	const response: Response = await sendRequest('/api/auth/validateUser', 'post', { otp });

	if (!response.ok) {
		const	p = document.getElementById("verify-email-msg-error");
		if (!p)
			console.error("No HTMLElement named \`msg-error\`.");
		else {
			const	result = await response.json();
			p.textContent = result?.error || "An unexpected error has occurred";
		}
		return ;
	}

	user.setSigned(true);
	
	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(user.getUsername());

	router.canLeave = true;
	router.navigate("/", gameState, user);
}

async function	handle2faForm(form: HTMLFormElement, gameState: GameState, user: User): Promise<void> {
	console.log("2fa");

	const	otp: string = (document.getElementById("digit-code") as HTMLInputElement).value;
	form.reset();

	const response: Response = await sendRequest('/api/twofa/validate', 'post', { otp });

	
	if (!response.ok) {
		const	p = document.getElementById("2fa-msg-error");
		if (!p)
			console.error("No HTMLElement named \`msg-error\`.");
		else {
			const	result = await response.json();
			p.textContent = result?.error || "An unexpected error has occurred";
		}
		return ;
	}

	user.setSigned(true);

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(user.getUsername());

	router.canLeave = true;
	router.navigate("/", gameState, user);
}

async function	handleUserSettingsForm(form: HTMLFormElement, gameState: GameState, user: User): Promise<void> {
	console.log("Save Settings");
	
	const	newUsername: string = (document.getElementById("edit-username") as HTMLInputElement).value;
	const	newEmail: string = (document.getElementById("edit-email") as HTMLInputElement).value;
	const	new2fa: boolean = (document.getElementById("edit-2fa") as HTMLInputElement).checked;

	console.log(newUsername, newEmail);
	const response: Response = await sendRequest(`/api/user/${user.getId()}`, 'post', {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa
	});
	
	if (!response.ok) {
		const	p = document.getElementById("user-setting-msg-error");
		if (!p)
			console.error(response.statusText);
		else {
			const	result = await response.json();
			p.textContent = result?.error || "An unexpected error has occurred";
		}
		return ;
	}

	const res: Response = await sendRequest(`/api/jwt/${user.getId()}`, 'delete', null);

	if (!res.ok) {
		const	p = document.getElementById("user-setting-msg-error");
		if (!p)
			console.error(response.statusText);
		else {
			const	result = await response.json();
			p.textContent = (result?.error || "An unexpected error has occurred") + ". We recommend that you try logging out!";
		}
		return ;
	}
	
	user.logout();
	router.navigate("/", gameState, user);
	location.reload();
}

async function	handleAddFriendForm(form: HTMLFormElement, gameState: GameState, user: User) {
	console.log("add friend form");

	const targetName: string = (document.getElementById("username-add-input") as HTMLInputElement).value;
	if (!targetName)
		return ;
	form.reset();

	const	respTargetId: Response = await sendRequest(`/api/user/lookup/${targetName}`, "get", null);
	if (!respTargetId.ok)
	{
		console.log((await respTargetId.json() as any).error)
		return ;																					//	AXEL: AFFICHER BULLE ERREUR
	}
	const	targetId: number = (await respTargetId.json() as any).id;

	const	response: Response = await sendRequest(`/api/user/friends/request/${targetId}`, "post", {});
	if (!response.ok)
	{
		console.log(await response.json())
		return ;																					//	AXEL: AFFICHER BULLE ERREUR
	}

	const	friendship: any = await response.json();

	if (friendship.status === "PENDING")
		console.log(`Request sended to ${targetName}.`);
	if (friendship.status === "ACCEPTED")
		console.log(`You are now friend with ${targetName}.`);

	await getAndRenderFriends();
}

export function	setupSubmitHandler(gameState: GameState, user: User): void {
	document.addEventListener('submit', async (event: SubmitEvent) => {
		event.preventDefault();

		const	form: HTMLFormElement = event.target as HTMLFormElement;

		if (form.id === "sign-in-form")
			await handleSignInForm(form, gameState, user);

		if (form.id === "sign-up-form")
			await handleSignUpForm(form, gameState, user);

		if (form.id === "verify-email-form")
			await handleVerifyEmailForm(form, gameState, user);

		if (form.id === "2fa-form")
			await handle2faForm(form, gameState, user);

		if (form.id === "user-settings-form")
			await handleUserSettingsForm(form, gameState, user);

		if (form.id === "add-friend-form")
			await handleAddFriendForm(form, gameState, user);
	});
}
