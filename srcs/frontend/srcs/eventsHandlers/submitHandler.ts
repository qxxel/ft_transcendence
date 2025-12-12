/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   submitHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:08:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/12 05:20:07 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY SUBMITS


/* ====================== IMPORTS ====================== */

import { verifyEmail }						from "../utils/verifyEmail.js"
import { AppState, appStore, UserState }	from "../objects/store.js"
import { displayError, displayPopError }	from "../utils/display.js"
import { getAndRenderFriends }				from "../friends/getAndRenderFriends.js"
import { getMenu }							from "../utils/getMenu.js"
import { router }							from "../index.js"
import { socket }							from "../socket/socket.js"
import { sendRequest }						from "../utils/sendRequest.js"



/* ====================== FUNCTIONS ====================== */

async function	handleSignInForm(form: HTMLFormElement): Promise<void> {
	console.log("Sign in");
	const	identifier: string = (document.getElementById("sign-in-username") as HTMLInputElement).value;
	const	password: string = (document.getElementById("sign-in-password") as HTMLInputElement).value;
	if (!identifier || !password) return;

	const	signForm = document.getElementById("sign-in-form");
	if (signForm)
		signForm.classList.add("darken");
	
	const	response: Response = await fetch('/api/auth/sign-in', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ identifier, password })
	});
	
	form.reset();
	if (signForm)
		signForm.classList.remove("darken");

	if (!response.ok)
			return displayError(response, "sign-in-msg-error");

	const	result: any = await response.json();

	if (socket && socket.connected)
		socket.disconnect();

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			id: result.id as number,
			username: result.username
		}
	}));

	if (result.is2faEnable) {
		router.navigate("/2fa");

		fetch('/api/twofa/otp', {
			method: 'POST',
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ })
		}).then((response) => {
				if (!response.ok)
					displayPopError(response);
			});
		
		return ;
	}

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;

	const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(true);

	router.navigate("/");
}

async function	handleSignUpForm(form: HTMLFormElement): Promise<void> {
	console.log("Sign up");

	const	username: string = (document.getElementById("sign-up-username") as HTMLInputElement).value;
	const	email: string = (document.getElementById("sign-up-email") as HTMLInputElement).value;
	const	password: string = (document.getElementById("sign-up-password") as HTMLInputElement).value;

	if (!username || !email || !password) return;
	form.reset();

	const	response: Response = await fetch('/api/auth/sign-up', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, email, password })
	});

	if (!response.ok)
		return displayError(response, "sign-up-msg-error");
	
	const	result = await response.json();

	if (socket && socket.connected)
		socket.disconnect();

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			id: result.id as number,
			username: username
		}
	}));

	verifyEmail("sign-up", "verify-email", email);
}

async function	handleVerifyEmailForm(form: HTMLFormElement): Promise<void> {
	console.log("VerifyEmail");

	const	otp: string = (document.getElementById("digit-code") as HTMLInputElement).value;
	if (!otp) return;
	form.reset();
	
	const response: Response = await sendRequest('/api/auth/validateUser', 'post', { otp });

	if (!response.ok)
		return displayError(response, "verify-email-msg-error");

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;

	var	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

async function	handle2faForm(form: HTMLFormElement): Promise<void> {
	console.log("2fa");

	const	otp: string = (document.getElementById("digit-code") as HTMLInputElement).value;
	if (!otp) return;
	form.reset();

	const response: Response = await sendRequest('/api/twofa/validate', 'post', { otp });

	if (!response.ok)
		return displayError(response, "2fa-msg-error");

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;

	const	menu: HTMLElement = document.getElementById("nav") as HTMLElement;
	if (menu)
		menu.innerHTML = getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

interface	userUpdate {
	username?: string;
	email?: string;
	avatar?: string;
	is2faEnable?: boolean;
}

async function verifyProfileStep(user: userUpdate, isChangeEmail: boolean): Promise<boolean> {
	return new Promise((resolve) => {
		if (isChangeEmail) {
			const twofaElements = document.querySelectorAll(".twofa");
	
			twofaElements.forEach(e => {
				(e as HTMLElement).hidden = false;
			});
			const	digitCode = (document.getElementById("digit-code") as HTMLInputElement);
	
			if (digitCode) {
				digitCode.required = true;
			}
		}

		const verifyForm = document.getElementById("confirm-setting-form") as HTMLFormElement;
		// if (!verifyForm) return;

		verifyForm.addEventListener("submit", async (event: Event) => {
			event.preventDefault();
			const	form = event.target as HTMLFormElement;
			const	otp: string = (document.getElementById("digit-code") as HTMLInputElement).value;
			const	password: string = (document.getElementById("confirm-setting-password") as HTMLInputElement).value;
			form.reset();

			const response: Response = await sendRequest('/api/auth/updateUser', 'PATCH', { otp, password, user });
			if (!response.ok) 
				return displayError(response, "confirm-setting-msg-error");
			router.canLeave = true;
			resolve(true);
		});
	});
}

async function	handleUserSettingsForm(form: HTMLFormElement): Promise<void> {
	console.log("Save Settings");
	
	const	newUsername: string = (document.getElementById("edit-username") as HTMLInputElement).value;
	const	newEmail: string = (document.getElementById("edit-email") as HTMLInputElement).value;
	const	new2fa: boolean = (document.getElementById("edit-2fa") as HTMLInputElement).checked;

	if (!newUsername || !newEmail || new2fa === null) return;

	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;

	console.log(newUsername, newEmail, new2fa);
	
	const getUser: Response = await sendRequest(`/api/user/me`, 'get', null)
	if (!getUser.ok)
		return displayError(getUser, "user-setting-msg-error");
	
	const	resultGetUser = await getUser.json();
	
	console.log(resultGetUser.username, resultGetUser.email, resultGetUser.is2faEnable);
	if (resultGetUser.username == newUsername
		&& resultGetUser.email == newEmail
		&& resultGetUser.is2faEnable == new2fa
	) return router.navigate("/user");
	
	const postUser: Response = await sendRequest(`/api/user/me/validate`, 'post', {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa
	});
	if (!postUser.ok)
		return displayError(postUser, "user-setting-msg-error");
	
	verifyEmail("user-profile", "confirm-setting", newEmail);

	const userUpdate: userUpdate = {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa,
	}

	const verified = await verifyProfileStep(userUpdate, !(resultGetUser.email == newEmail));
	if (!verified) 
		return;

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			username: newUsername,
			isAuth: new2fa
		}
	}));

	router.navigate("/user");
}

async function	handleAddFriendForm(form: HTMLFormElement) {
	const targetName: string = (document.getElementById("username-add-input") as HTMLInputElement).value;
	if (!targetName)
		return ;
	form.reset();

	const	respTargetId: Response = await sendRequest(`/api/user/lookup/${targetName}`, "get", null);
	if (!respTargetId.ok)
	{
		displayPopError(respTargetId)
		return ;
	}
	const	targetId: number = (await respTargetId.json() as any).id;

	const	response: Response = await sendRequest(`/api/user/friends/request/${targetId}`, "post", {});
	if (!response.ok)
	{
		displayPopError(response)
		return ;
	}

	const	friendship: any = await response.json();

	if (friendship.status === "PENDING")
		console.log(`Request sended to ${targetName}.`);				//	DISPLAY POP
	if (friendship.status === "ACCEPTED")
		console.log(`You are now friend with ${targetName}.`);			//	DISPLAY POP

	await getAndRenderFriends();
}

export function	setupSubmitHandler(): void {
	document.addEventListener('submit', async (event: SubmitEvent) => {
		event.preventDefault();

		const	form: HTMLFormElement = event.target as HTMLFormElement;

		if (form.id === "sign-in-form")
			await handleSignInForm(form);

		if (form.id === "sign-up-form")
			await handleSignUpForm(form);

		if (form.id === "verify-email-form")
			await handleVerifyEmailForm(form);

		if (form.id === "2fa-form")
			await handle2faForm(form);

		if (form.id === "user-settings-form")
			await handleUserSettingsForm(form);

		if (form.id === "add-friend-form")
			await handleAddFriendForm(form);
	});
}
