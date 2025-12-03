/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 17:53:31 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/30 21:13:49 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT SETUP SOCKET.IO


/* ============================= IMPORT ============================= */

import { io, Socket }	from 'socket.io-client'


/* ============================= SETUP WEBSOCKET ============================= */


// const URL = "https://localhost:8080/"; 

let socket: Socket;

export const	connectSocket = () => {
	socket = io('/', {
		path: '/socket.io',
		transports: ["websocket"],
		secure: true,
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

export const	sendKeyPress = (key: string) => {
	if (socket && socket.connected) {
		socket.emit("touche_appuyee", { key });
	} else {
		console.log("⏳ Attente de connexion pour envoyer :", key);
	}
};