/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   verifyEmail.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/05 19:11:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/13 07:36:01 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { router }						from "../index.js"
import { displayDate, displayPopError }	from "./display.js"

export async function	verifyEmail(idDivHidden: string, idDivVisible: string, email: string): Promise<void> {

	const	response: Response = await fetch('/api/jwt/payload/twofa', {
		method: "GET",
		credentials: "include"
	});

	if (response.ok) {
		const	result = await response.json();
		
		if (result.exp)
			displayDate(result.exp * 1000);
		else
			displayPopError("Unable to display the expiration date");
	} else {
		displayDate(Date.now() + 5 * 60 * 1000);
	}

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
		}
	).then(async (res) => {
			if (!res.ok)
				displayPopError(res)
		}
	);
}