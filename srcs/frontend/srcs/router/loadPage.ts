/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadPage.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/14 03:21:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:58:50 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// LOAD AND DISPLAY USER AND 2FA DATA ON THE PAGE


/* ====================== IMPORTS ====================== */

import { router }						from "../index.js"
import { displayDate, displayPopError }	from "../utils/display.js"
import { sendRequest }					from "../utils/sendRequest.js"
import { btnCooldown }					from "../utils/buttonCooldown.js"

/* ====================== FUNCTION ====================== */

export async function loadTwofa() {
	const	Response: Response = await sendRequest(`/api/jwt/payload/twofa`, 'get', null);
	
	if (!Response.ok) {
		console.log(Response.statusText);
		router.navigate("/sign-in");
		return ;
	}
	
	Response.json()
		.then((result) => {
			if (result.exp)
				displayDate(result.exp * 1000);
			else
				displayPopError("Unable to display the expiration date");
		}
	).catch((err: unknown) => {
		if (err instanceof Error)
			displayPopError(err.message);
	});
	
	router.canLeave = false;
	btnCooldown();
}

export async function loadUser() {
	const	Response: Response = await sendRequest(`/api/user/me`, 'get', null);
	if (!Response.ok) {
		console.log(Response.statusText)
		return ;
	}

	const	userRes = await Response.json();

	const	imgElement: HTMLImageElement = document.getElementById("user-avatar") as HTMLImageElement;
	const	displayImgElement: HTMLImageElement = document.getElementById("display-user-avatar") as HTMLImageElement;
	if (imgElement && displayImgElement)
	{
		if (userRes.avatar)
		{
			imgElement.src = "/uploads/" + userRes.avatar;
			displayImgElement.src = "/uploads/" + userRes.avatar;
		}
		else
		{	
			imgElement.src = "/assets/default_avatar.png";
			displayImgElement.src = "/assets/default_avatar.png";
		}
	}

	if (userRes.is2faEnable == true) {
		const	switchSpan = document.getElementById("switch-span") as HTMLInputElement;
		if (switchSpan) {
			switchSpan.textContent = "Enabled";
			switchSpan.classList.add('status-enabled');
			switchSpan.classList.remove('status-disabled');
		}

		const	checkbox2fa = document.getElementById("edit-2fa") as HTMLInputElement;
		if (checkbox2fa)
			checkbox2fa.checked = true;
	}

	const	usernameEl = document.getElementById("user-username") as HTMLSpanElement;
	const	emailEl = document.getElementById("user-email") as HTMLSpanElement;
	
	if (usernameEl && emailEl) {
		usernameEl.textContent = userRes.username ?? "";
		emailEl.textContent = userRes.email ?? "";
	}
}
