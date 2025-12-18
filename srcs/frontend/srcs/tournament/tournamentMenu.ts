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

	try {
		const	response: Response = await sendRequest(`/api/user/me`, 'get', null);
		
		if (response.ok)
		{
			const	ranked: HTMLElement | null = document.getElementById('menu-ranked');
			if (ranked instanceof HTMLElement) {
				ranked.style.display = 'block';
			} else
				displayPop("Missing navigation HTMLElement!", "error");
		}
	} catch(err) {
		displayPop("" + err, "error"); // MCURTO ON EST SUR DE CA ?? AU PIRE RIEN HEIN
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
	} catch (err) { return; }

	const element: HTMLElement | null = document.getElementById('ranked-p1');
	if (!(element instanceof HTMLInputElement)) {
		displayPop("Missing navigation HTMLElement!", "error");
		return;
	}
	element.value = self.username;
}