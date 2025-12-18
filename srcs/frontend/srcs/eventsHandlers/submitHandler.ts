/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   submitHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:08:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 06:05:58 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY SUBMITS


/* ====================== IMPORTS ====================== */

import { AppState, appStore }		from "../objects/store.js"
import { displayError, displayPop }	from "../utils/display.js"
import { router }					from "../index.js"
import { socket }					from "../socket/socket.js"
import { getMenu }					from "../utils/getMenu.js"
import { sendRequest }				from "../utils/sendRequest.js"
import { verifyEmail }				from "../utils/verifyEmail.js"
import { getAndRenderFriends }		from "../friends/getAndRenderFriends.js"
import { uploadAvatar }				from "../utils/uploadAvatar.js"
import { heartbeat }				from "../utils/heartbeat.js"


/* ====================== FUNCTIONS ====================== */

async function	handleSignInForm(form: HTMLFormElement): Promise<void> {
	const	identifier: string | undefined = (document.getElementById("sign-in-username") as HTMLInputElement)?.value;
	const	password: string | undefined = (document.getElementById("sign-in-password") as HTMLInputElement)?.value;
	if (!identifier || !password) return displayError("Identifier and password required!", "sign-in-msg-error");

	document.getElementById("sign-in-form")?.classList.add("darken");

	const	p: HTMLElement | null = document.getElementById("sign-in-msg-error");
	if (p) p.textContent = null;
	
	const	response: Response = await fetch('/api/auth/sign-in', {
		method: "post",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ identifier, password })
	});
	
	form.reset();
	document.getElementById("sign-in-form")?.classList.remove("darken");

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
		}).then((response: Response) => {
			if (!response.ok)
				displayPop(response, "error");
		}).catch((e: unknown) => {
			displayPop("" + e, "error");
		});
		
		return;
	}

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	heartbeat();

	getMenu(true);

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
	const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
	if (!otp) return displayError("Digit-code required!", "verify-email-msg-error");
	
	document.getElementById("verify-email-form")?.classList.add("darken");
	
	const	p = document.getElementById("verify-email-msg-error");
	if (p) p.textContent = null;

	const	response: Response = await sendRequest('/api/auth/validateUser', 'post', { otp });
	
	form.reset();
	document.getElementById("verify-email-form")?.classList.remove("darken");

	if (!response.ok)
		return displayError(response, "verify-email-msg-error");

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	heartbeat();

	getMenu(true);

	router.canLeave = true;
	router.navigate("/");
}

async function	handle2faForm(form: HTMLFormElement): Promise<void> {
	const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
	if (!otp) return displayError("Digit-code required!", "2fa-msg-error");

	document.getElementById("2fa-form")?.classList.add("darken");
	
	const	p = document.getElementById("2fa-msg-error");
	if (p) p.textContent = null;

	const	response: Response = await sendRequest('/api/twofa/validate', 'post', { otp });
	
	form.reset();
	document.getElementById("2fa-form")?.classList.remove("darken");

	if (!response.ok)
		return displayError(response, "2fa-msg-error");

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			isAuth: true
		}
	}));

	heartbeat();

	getMenu(true);

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
				displayPop("Missing HTMLElement!", "error");
				reject(false);
			}
		}

		const	verifyForm: HTMLElement | null = document.getElementById("confirm-setting-form")

		if (!(verifyForm instanceof HTMLFormElement)) return displayPop("Missing form HTMLElement!", "error");

		verifyForm.addEventListener("submit", async (event: Event) => {
			event.preventDefault();
			const	form = event.target;
			const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
			const	password: string | undefined = (document.getElementById("confirm-setting-password") as HTMLInputElement)?.value;
			
			if (!password) return displayError("password required!", "confirm-setting-msg-error");

			document.getElementById("confirm-setting-form")?.classList.add("darken");
			
			const	p = document.getElementById("confirm-setting-msg-error");
			if (p) p.textContent = null;

			const	response: Response = await sendRequest('/api/auth/updateUser', 'PATCH', { otp, password, user });
			
			if (form instanceof HTMLFormElement)
				form.reset();
			document.getElementById("confirm-setting-form")?.classList.remove("darken");

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

	if (!newUsername || !newEmail || new2fa === undefined)
		return displayError("Username, email et 2fa required!", "user-setting-msg-error");

	const	state: AppState = appStore.getState();

	const	getUser: Response = await sendRequest(`/api/user/me`, 'get', null)
	if (!getUser.ok)
		return displayPop(getUser, "error");

	
	const	resultGetUser = await getUser.json(); // /!\ try catch
	
	if (resultGetUser.username == newUsername
		&& resultGetUser.email == newEmail
		&& resultGetUser.is2faEnable == new2fa
		&& state.user.pendingAvatar === null
	) return router.navigate("/user");

	
	const	postUser: Response = await sendRequest(`/api/user/me/validate`, 'post', {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa
	});
	if (!postUser.ok)
		return displayError(postUser, "user-setting-msg-error");

	
	if (resultGetUser.email != newEmail)
		verifyEmail("user-profile", "confirm-setting", newEmail);
	else
		verifyEmail("user-profile", "confirm-setting", null);

	const statsContainer = document.getElementById("user-stats-container");
	if (statsContainer) statsContainer.hidden = true;

	const	userUpdate: userUpdate = {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa,
	}

	if (state.user.pendingAvatar)
	{
		uploadAvatar();
		if (resultGetUser.username == newUsername && resultGetUser.email == newEmail && resultGetUser.is2faEnable == new2fa)
			return;			//	MATHIS: NE PAS DEMANDER DE VERIF ICI
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

async function	handleAddFriendForm(form: HTMLFormElement): Promise<void> {
	const	targetNameElement: HTMLInputElement | undefined = (document.getElementById("username-add-input") as HTMLInputElement);
	if (!targetNameElement)
		return displayPop("Missing HTMLElement!", "error");

	const	targetName: string | undefined = targetNameElement.value;
	if (!targetName)
		return;
	form.reset();

	const	respTargetId: Response = await sendRequest(`/api/user/lookup/${targetName}`, "get", null);
	if (!respTargetId.ok)
		return displayPop(respTargetId, "error");

	const	targetId: number = (await respTargetId.json() as any).id; // try catch (json peut throw)

	const	response: Response = await sendRequest(`/api/user/friends/request/${targetId}`, "post", {});
	if (!response.ok)
		return displayPop(response, "error")

	const	friendship: any = await response.json();

	if (friendship.status === "PENDING")
		displayPop(`Request sended to ${targetName}.`, "success");
	if (friendship.status === "ACCEPTED")
		displayPop(`You are now friend with ${targetName}.`, "success");

	await getAndRenderFriends();
}

export function	setupSubmitHandler(): void {
	document.addEventListener('submit', async (event: SubmitEvent) => {
		event.preventDefault();

		const	form: EventTarget | null = event.target;
		if (!(form instanceof HTMLFormElement))
			return displayPop("Missing form HTMLElement!", "error");

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
