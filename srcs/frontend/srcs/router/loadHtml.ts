/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHtml.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:01:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:42:19 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT LOAD HTML FILE


/* ====================== FUNCTION ====================== */

export async function	loadHtml(path: string): Promise<string> {
	const	response: Response = await fetch(path);

	if (!response.ok)
		return `<h1>Error ${response.status}</h1><p>Unable to load ${path}</p>`;

	return await response.text();
}
