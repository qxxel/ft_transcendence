/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   display.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 10:47:11 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:31:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// UTILITY FUNCTIONS TO DISPLAY ERRORS AND FORMATTED DATES ON THE FRONTEND


/* ====================== IMPORT ====================== */

import { safeCreateElement }	from "./safeFunction.js"


/* ====================== FUNCTION ====================== */

export async function displayError(response: Response | string, idMsgError: string): Promise<void> {
	const	p: HTMLElement | null = document.getElementById(idMsgError);
	if (!p) {
		displayPop("error", "No HTMLElement named \`msg-error\`.");
	} else {
		if (typeof response === "string")
			p.textContent = response;
		else
		{
			try {
				const	result = await response.json();
				p.textContent = result?.error || "An unexpected error has occurred";
			} catch (error: unknown) {
				displayPop("error", error);	//	MATHIS
			}
		}
	}
}

async function toString(str: Response | string | unknown): Promise<string | null> {
	if (typeof str === "string") {
		return str;
	} else if (str instanceof Response) {
		try {
			const	result = await str.json();
			if (!str.ok) {
				if (typeof result.error === "string") return result.error;
			} else {
				if (typeof result.data === "string") return result.data;
				else if (typeof result.data === "object") return JSON.stringify(result.data);
			}
		} catch (error: unknown) {
			console.error("Failed to parse or serialize JSON.");
		}
	} else if (str instanceof Error) {
		return str.message
	} else if (typeof str === "object") {
		try {
			return JSON.stringify(str);
		} catch (error: unknown) {
			console.error("Failed to serialize JSON.");
		}
	}
	return null;
}

//	KILLIAN/MATHIS/AXEL: VOIR POUR TEXTCONTENT
export async function	displayPop(type: "notif" | "success" | "error", ...responses: Array<Response | string | unknown>): Promise<void> {
	const	divNotifs: HTMLElement | null = document.getElementById("div-notif");
	if (!divNotifs) return console.error("No HTMLElement named \`div-notif\`.");

	const	p: HTMLElement | unknown = safeCreateElement("p");
	const	span: HTMLElement | unknown = safeCreateElement("span");
	const	div: HTMLElement | unknown = safeCreateElement("div");
	if (!(p instanceof HTMLParagraphElement) || !(span instanceof HTMLSpanElement) || !(div instanceof HTMLDivElement))
		return console.error(typeof p === "string" ? p :"Failed to create DOM elements.");

	span.textContent = "✕";
	div.classList = type;
	
	try {
		div.addEventListener("click", () => {
			if (div instanceof HTMLDivElement) div.remove();
		});
	} catch (error: unknown) {
		console.error("Failed to attach click event listener to element.");
	}
	
	let msg: string = "";
	if (type === "error")
		msg += "error: ";

	for (const response of responses) {
		msg += toString(response) || "";
	}

	p.textContent = msg;

	setTimeout(() => {
		if (div instanceof HTMLDivElement) div.remove();
	}, 10000);

	try {
		div.appendChild(p);
		div.appendChild(span);
		divNotifs.appendChild(div);
	} catch (error: unknown) {
		console.error("Failed to append elements to the DOM.");
	}
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