/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   display.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 10:47:11 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/05 21:44:22 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function displayError(response: Response, idMsgError: string) {
	const	p = document.getElementById(idMsgError);
	if (!p) {
		console.error("No HTMLElement named \`msg-error\`.");
		console.error(response.statusText);
	} else {
		try {
			console.log("2")
			const	result = await response.json();
			console.log("3")
			p.textContent = result?.error || "An unexpected error has occurred";
		} catch (error) {
			console.error(error);
			console.error(response.statusText);
		}
	}
}

export function displayDate(min: number) {
	const localeClient = navigator.language;
	
	const maintenant = new Date();
	maintenant.setMinutes(maintenant.getMinutes() + min);

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	};

	const el = document.getElementById("date-with-offset");
	if (el)
		el.textContent = maintenant.toLocaleString(localeClient, options);
}