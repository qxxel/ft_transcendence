/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHtml.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:01:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 09:18:28 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { displayPop } from "../utils/display";

// FUNCTION THAT LOAD HTML FILE


/* ====================== FUNCTION ====================== */

export async function	loadHtml(path: string): Promise<string> {
	try {
		const	response: Response = await fetch(path);
	
		if (!response.ok)
			return `<h1>Error ${response.status}</h1><p>Unable to load ${path}</p>`;
	
		return await response.text();
	} catch (error: unknown) {
		displayPop("error", "id-error", error)
		return `<h1>Error</h1><p>Unable to load ${path}</p>`;
	}
}
