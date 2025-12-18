/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   postNavigationUtils.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 10:55:12 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 15:08:09 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL UTILS TO POST NAVIGATION ARE LOCATED HERE


/* ====================== IMPORTS ====================== */

import { router }				from "../index.js"
import { loadTwofa, loadUser, loadUserStats }	from "./loadPage.js"
import { loadTournamenSetupRanked, loadTournamentMenu }	from "../tournament/tournamentMenu.js"
import { PongGame }				from "../Pong/pong.js"
import { appStore }				from "../objects/store.js"
import { displayPop }				from "../utils/display.js"
import { Game }					from "../Pong/gameClass.js"
import { TournamentController }	from "../Pong/tournament.js"
import { initHistoryListeners } from "../history/getAndRenderHistory.js"
import { getAndRenderFriends } 	from  "../friends/getAndRenderFriends.js"

import type { AppState, UserState }		from "../objects/store.js"
import { attachAvatarUploadListener }	from "../eventsHandlers/changeListener.js"


/* ====================== FUNCTION ====================== */

export async function  pathActions(currentPath: string): Promise<void> {
	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;
	const	currentGame: Game | null = state.game.currentGame;
	const	currentTournament: TournamentController | null = state.game.currentTournament;

	if (!['/pong', '/tank'].includes(currentPath)) {
		if (currentGame) 
			currentGame.stop();
	}

	if (!['/tournament-setup', '/tournament-setup-ranked', '/tournament-bracket', '/pong'].includes(currentPath)) {
		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentTournament: null,
				pendingOptions: null
			}
		}));
	}

	if (['/pong'].includes(currentPath)) {
		if (currentGame)
		{
			currentGame.setCtx();
			currentGame.start();
		}
		else
			router.navigate("/pongmenu");
	}

	if (['/user'].includes(currentPath)) {
		if (user.isAuth){
			await loadUser();
			await loadUserStats(null, null);
		}
	}

	if (['/2fa'].includes(currentPath))
		loadTwofa();

	if (['/sign-in', '/sign-up'].includes(currentPath)) {
		if (user.isAuth)
			router.navigate("/");
	}

	if (['/history', '/user'].includes(currentPath)) {
		if (!user.isAuth){
			router.navigate("/");
		}
	}

	if (['/history'].includes(currentPath)) {
		if (user.isAuth){
			initHistoryListeners(null);
		}
	}

	if (['/pongmenu'].includes(currentPath)) {
		appStore.setState((state) => ({
			...state,
			game: {
				...state.game,
				currentGame: new PongGame('pong-canvas', 'score1', 'score2', 'winning-points')
			}
		}));

		const	slider: HTMLElement | null = document.getElementById('choosenMaxPoints');
		const	display: HTMLElement | null = document.getElementById('points-display');
		
		if (slider instanceof HTMLInputElement && display instanceof HTMLSpanElement) {
			display.textContent = slider.value;
			slider.addEventListener('input', () => {
				display.textContent = slider.value;
			});
		} else
			displayPop("Missing navigation HTMLElement!", "error");
	}

	if (['/tournament-menu'].includes(currentPath)) {
		loadTournamentMenu();
	}

	if (['/tournament-setup'].includes(currentPath)) {
		const	slider: HTMLElement | null = document.getElementById('choosenMaxPoints');
		const	display: HTMLElement | null = document.getElementById('points-display');
		
		if (slider instanceof HTMLInputElement && display instanceof HTMLSpanElement) {
		  display.textContent = slider.value;
		  slider.addEventListener('input', () => {
			display.textContent = slider.value;
		  });
		} else
			displayPop("Missing navigation HTMLElement!", "error");
	}

	if (['/tournament-setup-ranked'].includes(currentPath)) {
		if (!user.isAuth)
			router.navigate("/");	

		loadTournamenSetupRanked();
	}


	if (['/tournament-bracket'].includes(currentPath)) {
		if (!currentTournament) {
			router.navigate("/tournament-menu");
			return;
		}

		const container: HTMLElement | null = document.getElementById('bracket-container');
		if (container) {
			container.appendChild(currentTournament.renderBracket());

			currentTournament.fillBracket();
		} else
			displayPop("Missing navigation HTMLElement!", "error");
	}

	if (['/tank'].includes(currentPath)) {
		if (currentGame) {
			currentGame.setCtx();
			currentGame.start();
		}
		else {
			router.navigate("/tankmenu");
		}
	}

	if (['/friends'].includes(currentPath)) {
		if (!user.isAuth){
			router.navigate("/");
		}
		else
			getAndRenderFriends();
	}

	if (['/user'].includes(currentPath)) {
		if (user.id)
			attachAvatarUploadListener(user.id);
	}
}
