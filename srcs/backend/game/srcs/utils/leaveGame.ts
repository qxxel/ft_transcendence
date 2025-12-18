/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   leaveGame.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/18 14:40:35 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 14:43:28 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE WHEN USER LEAVE A GAME OR DISCONNECT


/* ====================== IMPORTS ====================== */

import { activeGames }	from "../socket/pongSocket.js"

import type { Socket }			from 'socket.io'
import type { PongInstance }	from "../services/game/pongInstance.js"


/* ====================== FUNCTION ====================== */

export function	leaveGameAndDisconnect(socket: Socket): void {
	if (activeGames.has(socket.id))
	{
		const	game: PongInstance | undefined = activeGames.get(socket.id);

		game?.stopGame();
		activeGames.delete(socket.id);
	}
}
