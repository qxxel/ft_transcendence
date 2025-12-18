/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   display.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 10:47:11 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/18 09:34:10 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// UTILITY FUNCTIONS TO DISPLAY ERRORS AND FORMATTED DATES ON THE FRONTEND


/* ====================== FUNCTION ====================== */

export async function displayError(response: Response | string, idMsgError: string): Promise<void> {
	const	p: HTMLElement | null = document.getElementById(idMsgError);
	if (!p) {
		displayPop("No HTMLElement named \`msg-error\`.", "error")
	} else {
		if (typeof response === "string")
			p.textContent = response;
		else
		{
			try {
				const	result = await response.json();
				p.textContent = result?.error || "An unexpected error has occurred";
			} catch (err) {
				displayPop("" + err, "error");	//	AXEL/MATHIS: PAS BEAU A VOIR
				// console.error(err);
				// displayPop(response, "error")
			}
		}
	}
}

export async function	displayPop(response: Response | string | undefined, type: "notif" | "success" | "error"): Promise<void> {
	const	divNotifs: HTMLElement | null = document.getElementById("div-notif");

	if (!divNotifs)
	{
		console.error("No HTMLElement named \`div-notif\`.");	// MATHIS: A VOIR COMMENT AFFICHER LES ERREURS ICI
		if (response instanceof Response)
			console.error(response.statusText);					// "
		else if (typeof response === "string")
			console.error(response);							// "
		else
			console.error("An unexpected error has occurred");	// "
		return;
	}
	const	p: HTMLParagraphElement = document.createElement("p");
	const	span: HTMLSpanElement = document.createElement("span");
	span.textContent = "✕";
	const	div: HTMLDivElement = document.createElement("div");
	div.classList = type;

	div.addEventListener("click", (event) => {
		const	target: EventTarget | null =  event.currentTarget;
		if (target instanceof HTMLElement)
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
			console.error(error);							// MATHIS: A VOIR COMMENT AFFICHER LES ERREURS ICI
			console.error(response.statusText);				// "
		}
	}
	else
		p.innerHTML = response || "An unexpected error has occurred"		//	MATHIS/AXEL: VOIR POUR TEXTCONTENT

	setTimeout(() => div.remove(), 10000);

	div.appendChild(p);
	div.appendChild(span);
	divNotifs.appendChild(div);
	divNotifs.hidden = false;
}

export function displayDate(date: number): void {
	const	localeClient: string = navigator.language;
	
	const	exp: Date = new Date(date);

	const	options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	};

	const	el: HTMLElement | null = document.getElementById("date-with-offset");
	if (el)
		el.textContent = exp.toLocaleString(localeClient, options);
}