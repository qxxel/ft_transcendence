/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   store.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 13:24:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/04 13:37:41 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL THE OBJECTS THAT ARE UTILS FOR THE APPSTORE


/* ====================== INTERFACES ====================== */

import { Game }					from "../Pong/gameClass"
import { GameOptions }			from "../Pong/objects/gameOptions"
import { TournamentController }	from "../Pong/tournament"


/* ====================== INTERFACES ====================== */

export interface	UserState {
	id: number | null;
	username: string | null;
	avatar: string | null;
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