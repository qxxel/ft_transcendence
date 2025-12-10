/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   verifyEmail.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/05 19:11:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/08 22:12:40 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { router }       from "../index.js"
import { displayDate, displayPopError }	from "./display.js"
import { sendRequest }	from "./sendRequest.js"

export async function	verifyEmail(idDivHidden: string, idDivVisible: string, email: string): Promise<void> {

	const	divHidden = document.getElementById(idDivHidden);
	if (divHidden)
		divHidden.hidden = true;

	const	divVerifyEmail = document.getElementById(idDivVisible);
	if (divVerifyEmail)
		divVerifyEmail.hidden = false;

	router.canLeave = false;

	fetch('/api/twofa/otp', {
			method: 'POST',
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email })
		})
		.then(async (res) => {
			if (!res.ok) {
				displayPopError(res)
				return ;
			}
		});
	displayDate(5);
}