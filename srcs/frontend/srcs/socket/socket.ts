/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 17:53:31 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:31:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT SETUP SOCKET.IO


/* ============================= IMPORT ============================= */

import { io, Socket }	from 'socket.io-client'


/* ============================= SETUP WEBSOCKET ============================= */

export let	socket: Socket;

export function	connectSocket() {
	if (socket)
	{
		socket.removeAllListeners();
		socket.disconnect();
	}

	socket = io('/', {
		path: '/socket.io',
		transports: ["websocket"],
		secure: true,
		withCredentials: true,
		reconnection: true,
	});

	socket.on("connect", () => { });

	socket.on("disconnect", () => { });

	socket.on("connect_error", (error) => {
		console.error("❌ Connection error WebSocket :", err.message);	// AXEL: DEBUG => A ENLEVER
	});
};

