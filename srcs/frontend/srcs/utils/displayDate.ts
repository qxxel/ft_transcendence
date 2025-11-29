/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   displayDate.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 10:47:11 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/26 10:58:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export function DisplayDate(min: number) {
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