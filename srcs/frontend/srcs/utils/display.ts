/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   display.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 10:47:11 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/08 23:49:14 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function displayError(response: Response, idMsgError: string) {
	const	p = document.getElementById(idMsgError);
	if (!p) {
		console.error("No HTMLElement named \`msg-error\`.");
		console.error(response.statusText);
	} else {
		try {
			const	result = await response.json();
			p.textContent = result?.error || "An unexpected error has occurred";
		} catch (error) {
			console.error(error);
			console.error(response.statusText);
		}
	}
}

export async function displayPopError(response: Response | string | undefined) {
	const	divErrors = document.getElementById("div-errors");
	if (!divErrors) {
		console.error("No HTMLElement named \`msg-error\`.");
		if (response instanceof Response)
			console.error(response.statusText);
		else if (typeof response === "string")
			console.error(response);
		else
			console.error("An unexpected error has occurred");
		return;
	}
	
	const p = document.createElement("p");
	const span = document.createElement("span");
	span.textContent = "x";
	const div = document.createElement("div");
	div.classList = "error";

	div.addEventListener("click", (event) => {
		const target =  event.currentTarget as HTMLElement;
		target.remove();
	})

	if (response instanceof Response) {
		try {
			const	result = await response.json();
			p.textContent = result?.error || "An unexpected error has occurred";
		} catch (error) {
			console.error(error);
			console.error(response.statusText);
		}
	} else {
		p.textContent = response || "An unexpected error has occurred"
	}
	div.appendChild(p);
	div.appendChild(span);
	divErrors.appendChild(div);
}

export function displayDate(min: number) {
	const localeClient = navigator.language;
	
	const	now = new Date();
	now.setMinutes(now.getMinutes() + min);

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
		el.textContent = now.toLocaleString(localeClient, options);
}