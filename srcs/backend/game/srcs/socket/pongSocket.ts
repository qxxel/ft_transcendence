/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongSocket.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 23:56:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/01 18:41:17 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT HANDLE THE INPUT AND SEND THE UPDATES OF THE PONG GAME WITH SOCKET


/* ====================== IMPORTS ====================== */

import { PongInstance }		from "../services/game/pongInstance.js"
import { PongService }		from "../services/pongService.js"
import { Server, Socket }	from 'socket.io'

import type { GameOptions }	from "../engine/pong/gameState.js"


/* ====================== CONST ACTIVE GAMES ====================== */

const	activeGames = new Map<string, PongInstance>();


/* ====================== FUNCTION ====================== */

export function	setupPongSocket(io: Server, socket: Socket, pService: PongService) {

	socket.on('join-game', (opts: GameOptions) => {
		try {
			if (activeGames.has(socket.id)) {
            const	oldGame: PongInstance | undefined = activeGames.get(socket.id);
            oldGame?.stopGame();
            activeGames.delete(socket.id);
        }

        // Sécurité options
        if (!opts)
		{
			console.error("No options !");
			return;
		}

			const	roomId: string = socket.id; 
	
			const	game: PongInstance = new PongInstance(io, roomId, pService, opts);
			activeGames.set(socket.id, game);
	
			game.startGame();
			console.log(`✅ Partie démarrée pour ${socket.id}`);
		} catch (err: unknown) {
			console.error("❌ CRASH lors de la création de la partie :", err);
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
