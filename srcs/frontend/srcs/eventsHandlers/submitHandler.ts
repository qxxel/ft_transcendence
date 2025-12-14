/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   submitHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:08:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:47:23 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY SUBMITS


/* ====================== IMPORTS ====================== */

import { verifyEmail }						from "../utils/verifyEmail.js"
import { appStore }							from "../objects/store.js"
import { displayError, displayPopError }	from "../utils/display.js"
import { getAndRenderFriends }				from "../friends/getAndRenderFriends.js"
import { getMenu }							from "../utils/getMenu.js"
import { router }							from "../index.js"
import { socket }							from "../socket/socket.js"
import { sendRequest }						from "../utils/sendRequest.js"



/* ====================== FUNCTIONS ====================== */

async function	handleSignInForm(form: HTMLFormElement): Promise<void> {
	const	identifier: string | undefined = (document.getElementById("sign-in-username") as HTMLInputElement)?.value;
	const	password: string | undefined = (document.getElementById("sign-in-password") as HTMLInputElement)?.value;
	if (!identifier || !password) return displayError("Identifier and password required!", "sign-in-msg-error");

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
		return displayError(response, "sign-in-msg-error"); // /!\ response.status

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
			}
		);

		return ;
	}

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	const	menu: HTMLElement | null = document.getElementById("nav");
	if (menu)
		menu.innerHTML = getMenu(true);

	router.navigate("/");
}

async function	handleSignUpForm(form: HTMLFormElement): Promise<void> {
	const	username: string | undefined = (document.getElementById("sign-up-username") as HTMLInputElement)?.value;
	const	email: string | undefined = (document.getElementById("sign-up-email") as HTMLInputElement)?.value;
	const	password: string | undefined = (document.getElementById("sign-up-password") as HTMLInputElement)?.value;

	if (!username || !email || !password) return displayError("Username, email and password required!", "sign-up-msg-error");
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
		return displayError(response, "sign-up-msg-error"); // /!\ response.status
	
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
	const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
	if (!otp) return displayError("Digit-code required!", "verify-email-msg-error");
	
	const	p = document.getElementById("verify-email-msg-error");
	if (p)
		p.textContent = null;
	
	const	signForm = document.getElementById("verify-email-form");
	if (signForm)
		signForm.classList.add("darken");

	const	response: Response = await sendRequest('/api/auth/validateUser', 'post', { otp });
	
	form.reset();
	if (signForm)
		signForm.classList.remove("darken");

	if (!response.ok)
		return displayError(response, "verify-email-msg-error"); // /!\ response.status

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	var	menu: HTMLElement | null = document.getElementById("nav");
	if (menu)
		menu.innerHTML = getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

async function	handle2faForm(form: HTMLFormElement): Promise<void> {
	const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
	if (!otp) return displayError("Digit-code required!", "2fa-msg-error");

	const	p = document.getElementById("2fa-msg-error");
	if (p)
		p.textContent = null;

	const	signForm = document.getElementById("2fa-form");
	if (signForm)
		signForm.classList.add("darken");

	const	response: Response = await sendRequest('/api/twofa/validate', 'post', { otp });
	
	form.reset();
	if (signForm)
		signForm.classList.remove("darken");

	if (!response.ok)
		return displayError(response, "2fa-msg-error"); // /!\ response.status

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	const	menu: HTMLElement | null = document.getElementById("nav");
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
	return new Promise((resolve, reject) => {
		if (isChangeEmail) {
			const	twofaElements: HTMLElement | null = document.getElementById("div-verify-email");
			const	digitCode: HTMLElement | null = document.getElementById("digit-code");
	
			if (twofaElements && digitCode instanceof HTMLInputElement) {
				twofaElements.hidden = false;
				digitCode.required = true;
			} else {
				displayPopError("Missing HTMLElement!");
				reject(false);
			}
		}

		console.log("verifyForm")
		const	verifyForm: HTMLElement | null = document.getElementById("confirm-setting-form")

		if (!(verifyForm instanceof HTMLFormElement)) return displayPopError("Missing form HTMLElement!");

		verifyForm.addEventListener("submit", async (event: Event) => {
			event.preventDefault();
			const	form = event.target;
			const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
			const	password: string | undefined = (document.getElementById("confirm-setting-password") as HTMLInputElement)?.value;
			
			if (!password) return displayError("password required!", "confirm-setting-msg-error");

			const	p = document.getElementById("confirm-setting-msg-error");
			if (p)
				p.textContent = null;

			const	confirmSettingForm = document.getElementById("confirm-setting-form");
			if (confirmSettingForm)
				confirmSettingForm.classList.add("darken");

			const	response: Response = await sendRequest('/api/auth/updateUser', 'PATCH', { otp, password, user });
			
			if (form instanceof HTMLFormElement)
				form.reset();
			if (confirmSettingForm)
				confirmSettingForm.classList.remove("darken");

			if (!response.ok) 
				return displayError(response, "confirm-setting-msg-error");
			
			router.canLeave = true;
			resolve(true);
		});
	});
}

async function	handleUserSettingsForm(form: HTMLFormElement): Promise<void> {
	const	newUsername: string | undefined = (document.getElementById("edit-username") as HTMLInputElement)?.value;
	const	newEmail: string | undefined = (document.getElementById("edit-email") as HTMLInputElement)?.value;
	const	new2fa: boolean | undefined = (document.getElementById("edit-2fa") as HTMLInputElement)?.checked;

	if (!newUsername || !newEmail || new2fa === undefined) return displayError("Username, email et 2fa required!", "user-setting-msg-error");
	
	const	getUser: Response = await sendRequest(`/api/user/me`, 'get', null)
	if (!getUser.ok)
		return displayPopError(getUser);
	
	const	resultGetUser = await getUser.json(); // /!\ try catch
	
	if (resultGetUser.username == newUsername
		&& resultGetUser.email == newEmail
		&& resultGetUser.is2faEnable == new2fa
	) return router.navigate("/user");
	
	const	postUser: Response = await sendRequest(`/api/user/me/validate`, 'post', {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa
	});
	if (!postUser.ok)
		return displayError(postUser, "user-setting-msg-error"); // /!\ response.status
	
	verifyEmail("user-profile", "confirm-setting", newEmail);

	const	userUpdate: userUpdate = {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa,
	}

	const	verified = await verifyProfileStep(userUpdate, !(resultGetUser.email == newEmail)); // /!\ try catch ???
	if (!verified) 
		return; // /!\ faire quelque chose

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			username: newUsername,
		}
	}));

	router.navigate("/user");
}

async function	handleAddFriendForm(form: HTMLFormElement) {
	const	targetName: string | undefined = (document.getElementById("username-add-input") as HTMLInputElement)?.value;
	if (!targetName)
		return ;
	form.reset();

	const	respTargetId: Response = await sendRequest(`/api/user/lookup/${targetName}`, "get", null);
	if (!respTargetId.ok)
	{
		displayPopError(respTargetId)
		return ;
	}
	const	targetId: number = (await respTargetId.json() as any).id; // try catch (json peut throw)

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

		const	form: EventTarget | null = event.target;
		if (!(form instanceof HTMLFormElement))
			return displayPopError("Missing form HTMLElement!");

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
