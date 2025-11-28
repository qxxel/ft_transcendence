/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   buttonCooldown.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 17:39:14 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/28 10:12:13 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function btnCooldown() {
	let Cooldown = 5;
	const btnCooldown = document.getElementById("btnCooldown");

	const interval = setInterval(() => {
		Cooldown--;
		if (!btnCooldown) {
			clearInterval(interval);
			return ;
		}
		btnCooldown.textContent = `(${Cooldown}s)`;

		if (Cooldown <= 0) {
			clearInterval(interval);
			btnCooldown.textContent = "";
			const btnSend2faCode = document.getElementById("btnSend2faCode") as HTMLButtonElement;
			const lock = document.querySelectorAll(".lock");
			lock.forEach(e => {
				(e as HTMLElement).hidden = true;
			});
			if (btnSend2faCode)
				btnSend2faCode.disabled = false;
		}
	}, 1000);
}