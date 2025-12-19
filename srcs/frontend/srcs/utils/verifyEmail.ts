/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   verifyEmail.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/05 19:11:00 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 09:04:13 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FILE THAT HANDLE THE VERIFY OF THE EMAIL


/* ====================== IMPORTS ====================== */

import { router }						from "../index.js"
import { displayDate, displayPop }		from "./display.js"


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
						displayPop("error", "id-error", "Unable to display the expiration date");
		
				}).catch((e: unknown) => {
					displayPop("error", "id-error", e);
				});
		
			}
			else
				displayDate(Date.now() + 5 * 60 * 1000);
		}).catch((e: unknown) => {
			displayPop("error", "id-error", e);
		});
	}

	const	divHidden = document.getElementById(idDivHidden);
	if (divHidden)
		divHidden.hidden = true;
	
	const	divVerifyEmail = document.getElementById(idDivVisible);
	if (divVerifyEmail)
		divVerifyEmail.hidden = false;
	else
		displayPop("error", "id-error", "Missing HTMLElement!");

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
				displayPop("error", "id-error", res);
		}).catch((e: unknown) => {
			displayPop("error", "id-error", e);
		});
	}
}
