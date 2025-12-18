/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentMenu.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/28 16:18:04 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 09:53:53 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FUNCTIONS THAT SETUP THE TOURNAMENT MENU/SETUP PAGE

/* ====================== IMPORT ====================== */

import { sendRequest }  from "../utils/sendRequest";
import { displayPop }   from "../utils/display";

/* ====================== FUNCTIONS ====================== */

export async function loadTournamentMenu() {

	const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
	
	if (response.ok)
	{
		const	ranked: HTMLElement | null = document.getElementById('menu-ranked');
		if (ranked instanceof HTMLElement) {
			ranked.style.display = 'block';
		} else
			displayPop("Missing navigation HTMLElement!", "error");
	}
}

export async function loadTournamenSetupRanked() {
	const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
	
	if (!response.ok) {
		return;
	}

	const e: HTMLElement | null = document.getElementById('ranked-p1');
	if (!(e instanceof HTMLInputElement)) {
		displayPop("Missing navigation HTMLElement!", "error");
		return;
	}
	const self = await response.json();
	e.value = self.username;
}