/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   verifyEmail.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/05 19:11:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 05:14:55 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT HANDLE THE VERIFY OF THE EMAIL


/* ====================== IMPORTS ====================== */

import { router }						from "../index.js"
import { displayDate, displayPop }	from "./display.js"


/* ====================== FUNCTIONS ====================== */

export function	verifyEmail(idDivHidden: string, idDivVisible: string, email: string | null, twofa: boolean = true): void {

	if (twofa) {
		fetch('/api/jwt/payload/twofa', {
			method: "GET",
			credentials: "include"
		}).then((response: Response) => {
			if (response.ok)
			{
				response.json(
				).then((result: any) => {
					if (result.exp)
						displayDate(result.exp * 1000);
					else
						displayPop("error", "Unable to display the expiration date");
		
				}).catch((e: unknown) => {
					displayPop("error", e);
				});
		
			}
			else
				displayDate(Date.now() + 5 * 60 * 1000);
		}).catch((e: unknown) => {
			displayPop("error", e);
		});
	}

	const	divHidden = document.getElementById(idDivHidden);
	if (divHidden)
		divHidden.hidden = true;
	
	const	divVerifyEmail = document.getElementById(idDivVisible);
	if (divVerifyEmail)
		divVerifyEmail.hidden = false;
	else
		displayPop("error", "Missing HTMLElement!");

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
		.then((res: Response) => {
			if (!res.ok)
				displayPop("error", res);
		}).catch((e: unknown) => {
			displayPop("error", e);
		});
	}
}
