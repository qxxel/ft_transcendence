/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 17:53:31 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/02 12:41:49 by agerbaud         ###   ########.fr       */
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

	socket.on("connect", () => {
		console.log(`✅ WEBSOCKET CONNECTED ! ID: ${socket.id}`);
	});

	socket.on("disconnect", () => {
		console.log("❌ DISCONNECTED");
	});

	socket.on("connect_error", (err) => {
		console.error("❌ Connection error WebSocket :", err.message);
	});

	socket.on("message_recu", (data) => {
		console.log("📩 Game server response: ", data);
	});
};

// export function	sendKeyPress(key: string) {
// 	if (socket && socket.connected) {
// 		socket.emit("touche_appuyee", { key });
// 	} else {
// 		console.log("⏳ Attente de connexion pour envoyer :", key);
// 	}
// };
