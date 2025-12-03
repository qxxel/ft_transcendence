/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   buttonCooldown.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 17:39:14 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/30 18:37:42 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function btnCooldown() {
	let timeLeft = 5;
    const spanCooldown = document.getElementById("btnCooldown");
    const btnSend = document.getElementById("btnSend2faCode") as HTMLButtonElement;
    const locks = document.querySelectorAll(".lock");

    const interval = setInterval(() => {
        timeLeft--;

        if (!spanCooldown) {
            clearInterval(interval);
            return;
        }

        spanCooldown.textContent = `(${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            
            spanCooldown.textContent = "";
            locks.forEach(e => (e as HTMLElement).hidden = true);
            
            if (btnSend) {
                btnSend.disabled = false;
            }
        }
    }, 1000);
}