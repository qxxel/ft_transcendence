/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentMenu.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 16:18:04 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 12:53:55 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FUNCTIONS THAT SETUP THE TOURNAMENT MENU/SETUP PAGE

/* ====================== IMPORT ====================== */

import { displayPop }   from "../utils/display"
import { sendRequest }  from "../utils/sendRequest"

/* ====================== FUNCTIONS ====================== */

export async function loadTournamentMenu() {

	try {
		const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
		
		if (response.ok)
		{
			const	ranked: HTMLElement | null = document.getElementById('menu-ranked');
			if (ranked instanceof HTMLElement) {
				ranked.style.display = 'block';
			} else
				displayPop("error", "id-error", "Missing navigation HTMLElement!");
		}
	} catch (error: unknown) {
		displayPop("error", "id-error", error);
	}
}

export async function loadTournamenSetupRanked() {

	let	response: Response;
	let	self: any;

	try {
		response = await sendRequest(`/api/user/me`, 'get', null);
		if (!response.ok) {
			return;
		}
		self = await response.json();
	} catch (error: unknown) {
		displayPop("error", "id-error", error);
		return;
	}

	const element: HTMLElement | null = document.getElementById('ranked-p1');
	if (!(element instanceof HTMLInputElement)) {
		displayPop("error", "id-error", "Missing navigation HTMLElement!");
		return;
	}
	element.value = self.username;
}