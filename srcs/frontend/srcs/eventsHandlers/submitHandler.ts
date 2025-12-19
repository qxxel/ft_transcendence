/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   submitHandler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:08:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 10:14:41 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CONTAINS FUNCTION THAT HANDLE EVERY SUBMITS


/* ====================== IMPORTS ====================== */

import { router }					from "../index.js"
import { AppState, appStore }		from "../objects/store.js"
import { displayError, displayPop }	from "../utils/display.js"
import { socket }					from "../socket/socket.js"
import { getMenu }					from "../utils/getMenu.js"
import { heartbeat }				from "../utils/heartbeat.js"
import { sendRequest }				from "../utils/sendRequest.js"
import { verifyEmail }				from "../utils/verifyEmail.js"
import { uploadAvatar }				from "../utils/uploadAvatar.js"
import { getAndRenderFriends }		from "../friends/getAndRenderFriends.js"

/* ====================== FUNCTIONS ====================== */

async function	handleSignInForm(form: HTMLFormElement): Promise<void> {
	const	identifier: string | undefined = (document.getElementById("sign-in-username") as HTMLInputElement)?.value;
	const	password: string | undefined = (document.getElementById("sign-in-password") as HTMLInputElement)?.value;
	if (!identifier || !password) return displayError("Identifier and password required!", "sign-in-msg-error");

	document.getElementById("sign-in-form")?.classList.add("darken");

	const	p: HTMLElement | null = document.getElementById("sign-in-msg-error");
	if (p) p.textContent = null;

	let	response: Response;
	try {
		response = await fetch('/api/auth/sign-in', {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ identifier, password })
		});
	} catch (error: unknown) {
		document.getElementById("sign-in-form")?.classList.remove("darken");
		return 	displayPop("error", "id-error", error);
	}

	form.reset();
	document.getElementById("sign-in-form")?.classList.remove("darken");

	if (!response.ok) {
		if (response.status === 409) {
			fetch('/api/jwt/refresh/logout', {
				method: "post",
				credentials: "include"
			}).catch((e: unknown) => displayPop("error", "id-error", e));
		}
		return displayError(response, "sign-in-msg-error");
	}

	let	result: any;
	try {
		result = await response.json();
	} catch (error: unknown) {
		return 	displayPop("error", "id-error", error);
	}

	if (socket && socket.connected)
		socket.disconnect();

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			id: result.id as number,
			username: result.username,
			avatar: result.avatar
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
				displayPop("error", "id-error", response);
		}).catch((e: unknown) => {
			displayPop("error", "id-error", e);
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

	if (!response.ok) {
		if (response.status === 409) {
			fetch('/api/jwt/refresh/logout', {
				method: "post",
				credentials: "include"
			}).catch((e: unknown) => displayPop("error", "id-error", e));
		}
		return displayError(response, "sign-up-msg-error");
	}
	
	const	result = await response.json();

	if (socket && socket.connected)
		socket.disconnect();

	appStore.setState((state) => ({
		...state,
		user: {
			...state.user,
			id: result.id as number,
			username: username,
			avatar: result.avatar
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

	try { 
		const	response: Response = await sendRequest('/api/auth/validateUser', 'post', { otp });
		form.reset();
		document.getElementById("verify-email-form")?.classList.remove("darken");
		if (!response.ok)
			return displayError(response, "verify-email-msg-error");
	}
	catch (error: unknown) {
		document.getElementById("verify-email-form")?.classList.remove("darken");
		return displayPop("error", "id-error", error);
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

	router.canLeave = true;
	router.navigate("/");
}

async function	handle2faForm(form: HTMLFormElement): Promise<void> {
	const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
	if (!otp) return displayError("Digit-code required!", "2fa-msg-error");

	document.getElementById("2fa-form")?.classList.add("darken");
	
	const	p = document.getElementById("2fa-msg-error");
	if (p) p.textContent = null;

	try {
		const	response: Response = await sendRequest('/api/twofa/validate', 'post', { otp });
		form.reset();
		document.getElementById("2fa-form")?.classList.remove("darken");
		if (!response.ok)
			return displayError(response, "2fa-msg-error");
	}
	catch (error: unknown) {
		document.getElementById("2fa-form")?.classList.remove("darken");
		return displayPop("error", "id-error", error);
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
				displayPop("error", "id-error", "Missing HTMLElement!");
				reject(false);
			}
		}

		const	verifyForm: HTMLElement | null = document.getElementById("confirm-setting-form")

		if (!(verifyForm instanceof HTMLFormElement)) return displayPop("error", "id-error", "Missing form HTMLElement!");

		verifyForm.addEventListener("submit", async (event: Event) => {
			event.preventDefault();
			const	form = event.target;
			const	otp: string | undefined = (document.getElementById("digit-code") as HTMLInputElement)?.value;
			const	password: string | undefined = (document.getElementById("confirm-setting-password") as HTMLInputElement)?.value;
			
			if (!password) return displayError("password required!", "confirm-setting-msg-error");

			document.getElementById("confirm-setting-form")?.classList.add("darken");
			
			const	p = document.getElementById("confirm-setting-msg-error");
			if (p) p.textContent = null;

			try {
				const	response: Response = await sendRequest('/api/auth/updateUser', 'PATCH', { otp, password, user });
				
				if (form instanceof HTMLFormElement)
					form.reset();
				document.getElementById("confirm-setting-form")?.classList.remove("darken");

				if (!response.ok) 
					return displayError(response, "confirm-setting-msg-error");
			} catch (error: unknown) {
				document.getElementById("confirm-setting-form")?.classList.remove("darken");
				return displayPop("error", "id-error", error);
			}
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
	let	resultGetUser:any;
	let	getUser: Response;
	let	postUser: Response;

	try {
		getUser = await sendRequest(`/api/user/me`, 'get', null)
		resultGetUser = await getUser.json();
		if (!getUser.ok)
			return displayPop("error", "id-error", getUser);
	} catch (error: unknown) {
		return displayPop("error", "id-error", error);
	}

	if (resultGetUser.username == newUsername
		&& resultGetUser.email == newEmail
		&& resultGetUser.is2faEnable == new2fa
		&& state.user.pendingAvatar === null
	) return router.navigate("/user");
	
	if (state.user.pendingAvatar)
	{
		await uploadAvatar();
		if (resultGetUser.username == newUsername && resultGetUser.email == newEmail && resultGetUser.is2faEnable == new2fa)
			return router.navigate("/user");
	}
	
	try {
		postUser = await sendRequest(`/api/user/me/validate`, 'post', {
			username: newUsername,
			email: newEmail,
			is2faEnable: new2fa
		});
		if (!postUser.ok)
			return displayError(postUser, "user-setting-msg-error");
	} catch (error: unknown) {
		return displayPop("error", "id-error", error);
	}
	
	if (resultGetUser.email != newEmail)
		verifyEmail("user-profile", "confirm-setting", newEmail, false);
	else
		verifyEmail("user-profile", "confirm-setting", null, false);

	const statsContainer = document.getElementById("user-stats-container");
	if (statsContainer) statsContainer.hidden = true;

	const	userUpdate: userUpdate = {
		username: newUsername,
		email: newEmail,
		is2faEnable: new2fa,
	}


	let	verified: boolean;
	try {
		verified = await verifyProfileStep(userUpdate, !(resultGetUser.email == newEmail));
		if (!verified) 
			return;
	} catch (error: unknown) {
		displayPop("error", "id-error", error)
		return;
	}

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
		return displayPop("error", "id-error", "Missing HTMLElement!");

	const	targetName: string | undefined = targetNameElement.value;
	if (!targetName)
		return;
	form.reset();

	let	respTargetId: Response;
	let response: Response;
	let	targetId: number;
	let	friendship: any;
	try {
		respTargetId = await sendRequest(`/api/user/lookup/${targetName}`, "get", null);
		if (!respTargetId.ok)
			return displayPop("error", "id-error", respTargetId);
		targetId = (await respTargetId.json() as any).id;
		response = await sendRequest(`/api/user/friends/request/${targetId}`, "post", {});
		if (!response.ok)
			return displayPop("error", "id-error", response)
		friendship = await response.json();
	} catch (error: unknown) {
		return displayPop("error", "id-error", error);
	}
	if (friendship.status === "PENDING")
		displayPop("success", "id-success", `Request sended to ${targetName}.`);
	if (friendship.status === "ACCEPTED")
		displayPop("success", "id-success", `You are now friend with ${targetName}.`);

	await getAndRenderFriends();
}

export function	setupSubmitHandler(): void {
	document.addEventListener('submit', async (event: SubmitEvent) => {
		event.preventDefault();

		const	form: EventTarget | null = event.target;
		if (!(form instanceof HTMLFormElement))
			return displayPop("error", "id-error", "Missing form HTMLElement!");

		try {
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
		} catch (error: unknown) {
			displayPop("error", "id-error", error);
		}
	});
}
