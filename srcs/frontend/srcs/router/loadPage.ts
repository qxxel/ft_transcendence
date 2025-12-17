/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadPage.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/14 03:21:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/17 06:02:33 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// LOAD AND DISPLAY USER AND 2FA DATA ON THE PAGE


/* ====================== IMPORTS ====================== */

import { router }						from "../index.js"
import { displayDate, displayPop }		from "../utils/display.js"
import { sendRequest }					from "../utils/sendRequest.js"
import { btnCooldown }					from "../utils/buttonCooldown.js"

/* ====================== FUNCTION ====================== */

export function loadTwofa(): void {
	sendRequest(
		`/api/jwt/payload/twofa`, 'get', null
	).then((response: Response) => {
		if (!response.ok)
		{
			displayPop(response, "error");
			router.navigate("/sign-in");
			return ;
		}
		
		response.json(
		).then((result) => {
			if (result.exp)
				displayDate(result.exp * 1000);
			else
				displayPop("Unable to display the expiration date", "error");
		}).catch((e: unknown) => {
			displayPop("" + e, "error");
		});

		router.canLeave = false;
		btnCooldown();
	}).catch((e: unknown) => {
		displayPop("" + e, "error");
	});
}

export async function loadUser() {
	const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
	if (!response.ok)
	{
		displayPop(response.statusText, "error");
		return ;
	}

	const	userRes: any = await response.json();

	const	responseStats: Response = await sendRequest(`/api/user/stats/me`, 'get', null);
	if (!responseStats.ok)
	{
		displayPop(responseStats, "error");
		return ;
	}

	const	userStatsRes: any = await responseStats.json();
	console.log(userStatsRes);

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
	} else
		displayPop("Missing avatar HTMLElement!", "error");

	if (userRes.is2faEnable == true) {
		const	switchSpan: HTMLElement | null = document.getElementById("switch-span");
		if (switchSpan instanceof HTMLInputElement) {
			switchSpan.textContent = "Enabled";
			switchSpan.classList.add('status-enabled');
			switchSpan.classList.remove('status-disabled');
		}

		const	checkbox2fa: HTMLElement | null = document.getElementById("edit-2fa");
		if (checkbox2fa instanceof HTMLInputElement)
			checkbox2fa.checked = true;
		
		if (!(switchSpan instanceof HTMLInputElement) && !(checkbox2fa instanceof HTMLInputElement))
			displayPop("Missing 2fa HTMLElement!", "error");
	}

	const	usernameEl: HTMLElement | null = document.getElementById("user-username");
	const	emailEl: HTMLElement | null = document.getElementById("user-email");
	
	if (usernameEl instanceof HTMLDivElement && emailEl instanceof HTMLDivElement) {
		usernameEl.textContent = userRes.username ?? "";
		emailEl.textContent = userRes.email ?? "";
	} else
		displayPop("Missing profile HTMLElement!", "error");
}
