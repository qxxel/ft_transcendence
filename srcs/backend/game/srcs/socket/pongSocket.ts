/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongSocket.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 23:56:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 03:57:00 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT HANDLE THE INPUT AND SEND THE UPDATES OF THE PONG GAME WITH SOCKET


/* ====================== IMPORTS ====================== */

import { Server, Socket }	from 'socket.io'
import { GamesService }		from "../services/gamesService.js"
import { PongInstance }		from "../services/game/pongInstance.js"

import type { PongOptions }	from "../engine/pong/pongState.js"


/* ====================== CONST ACTIVE GAMES ====================== */

const	activeGames = new Map<string, PongInstance>();


/* ====================== FUNCTION ====================== */

export function	setupPongSocket(io: Server, socket: Socket, pongService: GamesService) {

	const	userId: number | undefined = socket.data.user?.id;

	socket.on('join-game', (opts: PongOptions) => {
		try {
			if (activeGames.has(socket.id))
			{
				const	oldGame: PongInstance | undefined = activeGames.get(socket.id);
				oldGame?.stopGame();
				activeGames.delete(socket.id);
			}

			if (!opts)
			{
				console.error("No options.");
				return;
			}

			const	roomId: string = socket.id; 
	
			const	game: PongInstance = new PongInstance(io, roomId, pongService, userId, opts);
			activeGames.set(socket.id, game);
	
			game.startGame();
		} catch (err: unknown) {
			console.error("Error while game creation: ", err);
		}
	});

	socket.on('input', (data) => {
		const	game: PongInstance | undefined = activeGames.get(socket.id);
		if (game)
		{
			let	player: 1 | 2 = 1;

			if (['ArrowUp', 'ArrowDown'].includes(data.key))
				player = 2;

			console.log(data.key + " => " + player);
			game.handleInput(player, data.key, data.isPressed);
		}
	});

	socket.on('disconnect', () => {
		if (activeGames.has(socket.id))
		{
			const	game: PongInstance | undefined = activeGames.get(socket.id);

			game?.stopGame();
			activeGames.delete(socket.id);
		}
	});
}
