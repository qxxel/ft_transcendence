/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   postNavigationUtils.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/13 06:43:16 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO POST NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { appStore }				from "../objects/store.js"
import { btnCooldown }			from "../utils/buttonCooldown.js"
import { displayDate, displayPopError }			from "../utils/display.js"
import { Game }					from "../Pong/gameClass.js"
import { GameOptions }			from "../Pong/objects/gameOptions.js"
import { getAndRenderFriends }  from  "../friends/getAndRenderFriends.js"
import { PongGame }				from "../Pong/pong.js"
import { router }				from "../index.js"
import { sendRequest }			from "../utils/sendRequest.js"
import { TankGame }				from "../tank/tank.js"
import { TournamentController }	from "../Pong/tournament.js"

import type { AppState, UserState }	from "../objects/store.js"
import { attachAvatarUploadListener } from "../eventsHandlers/changeListener.js"


/* ====================== FUNCTION ====================== */

export async function  pathActions(currentPath: string): Promise<void> {
	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;
	const	currentGame: Game | null = state.game.currentGame;
	const	currentTournament: TournamentController | null = state.game.currentTournament;

	if (!['/pong', '/tank'].includes(currentPath))
	{
		if (currentGame) 
			currentGame.stop();
	}

	if (!['/tournament-setup', '/tournament-bracket', '/pong'].includes(currentPath))
	{
		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentTournament: null,
				pendingOptions: null
			}
		}));
	}

	if (['/pong'].includes(currentPath))
	{
		if (currentGame)
		{
			currentGame.setCtx();
			currentGame.start();
		}
		else
			router.navigate("/pongmenu");
	}

	if (['/user'].includes(currentPath))
		await loadUser(user);

	if (['/2fa'].includes(currentPath))
		await loadTwofa();

	if (['/sign-in', '/sign-up'].includes(currentPath))
	{
		if (user.isAuth)
			router.navigate("/");
	}

	if (['/history', '/user'].includes(currentPath))
	{
		if (!user.isAuth)
			router.navigate("/");
	}

	if (['/pongmenu'].includes(currentPath)) {
		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new PongGame('pong-canvas', 'score1', 'score2', 'winning-points')
			}
		}));

		const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
		const display = document.getElementById('points-display') as HTMLSpanElement;
		
		if (slider && display) {
			display.innerHTML = slider.value;
			slider.addEventListener('input', () => {
				display.innerHTML = slider.value;
			});
		}
	}

	if (['/tournament-setup'].includes(currentPath)) {
		const slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
		const display = document.getElementById('points-display') as HTMLSpanElement;
		
		if (slider && display) {
		  display.innerHTML = slider.value;
		  slider.addEventListener('input', () => {
			display.innerHTML = slider.value;
		  });
		}
	}

	if (['/tournament-bracket'].includes(currentPath)) {
		if (!currentTournament) {
			router.navigate("/tournament-setup");
			return;
		}

		const container = document.getElementById('bracket-container');
		if (container)
			container.innerHTML = currentTournament.renderBracket();
	}

	if (['/tank'].includes(currentPath)) {
		if (currentGame) {
			currentGame.setCtx();
			currentGame.start();
			console.log("Loading the new game...");
		}
		else {
			router.navigate("/tankmenu");
		}
	}

	if (['/friends'].includes(currentPath)) {
		getAndRenderFriends();
		console.log("Loading the friends...");
	}

	if (['/user'].includes(currentPath)) {
		if (user.id)
			attachAvatarUploadListener(user.id);
	}
}

async function loadTwofa() {
	const	Response: Response = await sendRequest(`/api/jwt/payload/twofa`, 'get', null);
	
	if (!Response.ok) {
		console.log(Response.statusText);
		router.navigate("/sign-in");
		return ;
	}
	
	Response.json()
		.then((result) => {
			console.log(result)
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

async function loadUser(user: UserState) {
	const	Response: Response = await sendRequest(`/api/user/me`, 'get', null);
		if (!Response.ok) {
			console.log(Response.statusText)
			return ;
		}

		const	userRes = await Response.json();

		const imgElement: HTMLImageElement = document.getElementById("user-avatar") as HTMLImageElement;
		const displayImgElement: HTMLImageElement = document.getElementById("display-user-avatar") as HTMLImageElement;
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
