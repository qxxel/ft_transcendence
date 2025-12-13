/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookies.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/12 23:23:05 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/12 23:25:38 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== FUNCTIONS ====================== */

export function	getCookies(cookie: string | undefined): Record<string, string> {
	return Object.fromEntries(
		(cookie || "")
		.split("; ")
		.map(c => c.split("="))
		.filter(([k, v]) => k && v)
	);
}