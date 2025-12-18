/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 17:53:31 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 16:03:51 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT SETUP SOCKET.IO


/* ============================= IMPORT ============================= */

import { io, Socket }	from 'socket.io-client'


/* ============================= SETUP WEBSOCKET ============================= */

export let	socket: Socket;

export function	connectSocket() {
	socket = io('/', {
		path: '/socket.io',
		transports: ["websocket"],
		secure: true,
		withCredentials: true,
		reconnection: true,
	});

	socket.on("connect", () => { });

	socket.on("disconnect", () => { });

	socket.on("connect_error", (err) => {
		console.error("❌ Connection error WebSocket :", err.message);	// AXEL: DEBUG => A ENLEVER
	});
};

