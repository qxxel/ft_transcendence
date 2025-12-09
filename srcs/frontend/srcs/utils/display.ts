/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   display.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 10:47:11 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/10 00:13:51 by agerbaud         ###   ########.fr       */
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

export async function	displayPop(response: Response | string | undefined, type: "notif" | "success" | "error") {
	const	divNotifs = document.getElementById("div-notif");
	if (!divNotifs)
	{
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
	span.textContent = "✕";
	const div = document.createElement("div");
	div.classList = type;

	div.addEventListener("click", (event) => {
		const	target =  event.currentTarget as HTMLElement;
		target.remove();
	})

	if (response instanceof Response)
	{
		try {
			const	result = await response.json();
			if (type === "error")
				p.textContent = result?.error || "An unexpected error has occurred";
			else
				p.textContent = result?.data || "An unexpected error has occurred";
		} catch (error) {
			console.error(error);
			console.error(response.statusText);
		}
	}
	else
		p.innerHTML = response || "An unexpected error has occurred"		//	MATHIS/AXEL: VOIR POUR TEXTCONTENT

	// setTimeout(() => div.remove(), 10000);

	div.appendChild(p);
	div.appendChild(span);
	divNotifs.appendChild(div);
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