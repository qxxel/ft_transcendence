/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   store.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 13:24:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 13:48:09 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE OBJECTS THAT ARE UTILS FOR THE APPSTORE


/* ====================== INTERFACES ====================== */

import { Game }					from "../Pong/gameClass"
import { Store }				from "../utils/store.js"
import { TournamentController }	from "../Pong/tournament"
import { GameOptions }			from "../Pong/objects/gameOptions"


/* ====================== INTERFACES ====================== */

export interface	UserState {
	id: number | null;
	username: string | null;
	avatar: string | null;
	pendingAvatar: File | null;
	isAuth: boolean;
}

export interface	GamesState {
	currentGame: Game | null;
	currentTournament: TournamentController | null;
	pendingOptions: GameOptions | null
};

export interface	AppState {
	user: UserState;
	game: GamesState;
}

const	initialState: AppState = {
	user: {
		id: null,
		username: null,
		avatar: null,
		pendingAvatar: null,
		isAuth: false
	},
	game: {
		currentGame: null,
		currentTournament: null,
		pendingOptions: null
	}
};

export const	appStore: Store<AppState> = new Store<AppState>(initialState);
