/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   displayDate.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 10:47:11 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/04 13:17:45 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FUNCTION THAT DISPLAY A DATE WITH TIMESTAMP


/* ====================== FUNCTION ====================== */

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