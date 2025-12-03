/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   vite.config.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/30 16:13:32 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/30 17:11:24 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE CONFIG OF VITE TO COMPILE THE FRONTEND


/* ============================= IMPORT ============================= */

import { defineConfig }	from 'vite'
import path				from 'path'

/* ============================= DEFINE CONFIG ============================= */

export default defineConfig({
	build: {
		outDir: "dist",
		target: "esnext",
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
        		"2fa": path.resolve(__dirname, 'pages/2fa.html'),
        		about: path.resolve(__dirname, 'pages/about.html'),
        		friends: path.resolve(__dirname, 'pages/friends.html'),
        		games: path.resolve(__dirname, 'pages/games.html'),
        		home: path.resolve(__dirname, 'pages/home.html'),
        		pong: path.resolve(__dirname, 'pages/pong.html'),
        		pongmenu: path.resolve(__dirname, 'pages/pongmenu.html'),
        		rperrot: path.resolve(__dirname, 'pages/rperrot.html'),
        		settings: path.resolve(__dirname, 'pages/settings.html'),
        		"sign-in": path.resolve(__dirname, 'pages/sign-in.html'),
        		"sign-up": path.resolve(__dirname, 'pages/sign-up.html'),
        		tank: path.resolve(__dirname, 'pages/tank.html'),
        		tankmenu: path.resolve(__dirname, 'pages/tankmenu.html'),
        		"tournament-bracket": path.resolve(__dirname, 'pages/tournament-bracket.html'),
        		"tournament-setup": path.resolve(__dirname, 'pages/tournament-setup.html'),
        		user: path.resolve(__dirname, 'pages/user.html'),
			}
		}
	}
});
