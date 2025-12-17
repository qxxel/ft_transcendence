/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   verifyEmail.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/05 19:11:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/17 03:26:34 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT HANDLE THE VERIFY OF THE EMAIL


/* ====================== IMPORTS ====================== */

import { router }						from "../index.js"
import { displayDate, displayPop }	from "./display.js"


/* ====================== FUNCTIONS ====================== */

export async function	verifyEmail(idDivHidden: string, idDivVisible: string, email: string | null): Promise<void> {

	const	response: Response = await fetch('/api/jwt/payload/twofa', {
		method: "GET",
		credentials: "include"
	});

	if (response.ok)
	{
		const	result = await response.json();

		if (result.exp)
			displayDate(result.exp * 1000);
		else
			displayPop("Unable to display the expiration date", "error");
	}
	else
		displayDate(Date.now() + 5 * 60 * 1000);

	const	divHidden = document.getElementById(idDivHidden);
	if (divHidden)
		divHidden.hidden = true;
	
	const	divVerifyEmail = document.getElementById(idDivVisible);
	if (divVerifyEmail)
		divVerifyEmail.hidden = false;
	else
		displayPop("Missing HTMLElement!", "error");

	router.canLeave = false;

	if (email)
	{
		fetch('/api/twofa/otp', {
			method: 'POST',
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email })
		})
		.then(async (res) => {
			if (!res.ok)
			{
				displayPop(res, "error")
				return ;
			}
		});
	}
}
