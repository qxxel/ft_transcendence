/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   buttonCooldown.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 17:39:14 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:25:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT HANDLE THE COOLDOWN ON BUTTONS

/* ====================== IMPORTS ====================== */

import { displayPop }	from "../utils/display";

/* ====================== FUNCTION ====================== */

export async function btnCooldown(): Promise<void> {
	let	timeLeft = 5;
	const	spanCooldown: HTMLElement | null = document.getElementById("btnCooldown");
	const	btnSend: HTMLElement | null = document.getElementById("btnSend2faCode");
	const	locks: NodeListOf<Element> = document.querySelectorAll(".lock");

	const	interval = setInterval(() => {
		timeLeft--;

		if (!spanCooldown) {
			clearInterval(interval);
			return displayPop("error", "id-error", "Missing HTMLElement!");
		}

		spanCooldown.textContent = `(${timeLeft}s)`;

		if (timeLeft <= 0) {
			clearInterval(interval);
			
			spanCooldown.textContent = "";
			locks.forEach(e => {
				if (e instanceof HTMLElement)
					e.hidden = true
			});
			
			if (btnSend instanceof HTMLButtonElement) {
				btnSend.disabled = false;
			} else
				displayPop("error", "id-error", "Missing HTMLElement!");
		}
	}, 1000);
}