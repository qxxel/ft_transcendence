/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   postNavigationUtils.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:11:07 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO POST NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { router }				from "../index.js"
import { loadTwofa, loadUser }	from "./loadPage.js"
import { PongGame }				from "../Pong/pong.js"
import { appStore }				from "../objects/store.js"
import { Game }					from "../Pong/gameClass.js"
import { TournamentController }	from "../Pong/tournament.js"
import { getAndRenderFriends } 	from  "../friends/getAndRenderFriends.js"

import type { AppState, UserState }		from "../objects/store.js"
import { attachAvatarUploadListener }	from "../eventsHandlers/changeListener.js"


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
		await loadUser();

	if (['/2fa'].includes(currentPath))
		await loadTwofa();

	if (['/sign-in', '/sign-up'].includes(currentPath))
	{
		if (user.isAuth)
			router.navigate("/");
	}

	if (['/history', '/user'].includes(currentPath))
	{
		if (!user.isAuth){
			router.navigate("/");
		}
	}

	if (['/history'].includes(currentPath))
	{
		console.log("ALERT WE ARE IN THE HISTORY !!!!"); // agerbaud help
	}

	if (['/pongmenu'].includes(currentPath)) {
		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new PongGame('pong-canvas', 'score1', 'score2', 'winning-points')
			}
		}));

		const	slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
		const	display = document.getElementById('points-display') as HTMLSpanElement;
		
		if (slider && display) {
			display.innerHTML = slider.value;
			slider.addEventListener('input', () => {
				display.innerHTML = slider.value;
			});
		}
	}

	if (['/tournament-setup'].includes(currentPath)) {
		const	slider = document.getElementById('choosenMaxPoints') as HTMLInputElement;
		const	display = document.getElementById('points-display') as HTMLSpanElement;
		
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

		const	container = document.getElementById('bracket-container');
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
