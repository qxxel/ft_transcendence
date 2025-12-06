/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   verifyEmail.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/05 19:11:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/05 20:06:58 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { router }       from "../index.js"
import { displayDate }	from "./display.js"
import { sendRequest }	from "./sendRequest.js"

export async function	verifyEmail(idDivHidden: string): Promise<void> {

	const	divHidden = document.getElementById(idDivHidden);
	if (divHidden)
		divHidden.hidden = true;

	const	divVerifyEmail = document.getElementById("verify-email");
	if (divVerifyEmail)
		divVerifyEmail.hidden = false;

	router.canLeave = false;

	fetch('/api/twofa/otp', {
			method: 'GET',
			credentials: "include"
		})
		.then(async (res) => {
			if (!res.ok) {
				const	p = document.getElementById("verify-email-msg-error");
				if (!p)
					console.error("No HTMLElement named \`msg-error\`.");
				else {
					const	resJson = await res.json();
					p.textContent = resJson?.error || "An unexpected error has occurred";
				}
				return ;
			}
		});
	displayDate(5);
}