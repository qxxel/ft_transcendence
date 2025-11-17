/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHtml.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:01:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 21:01:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT LOAD HTML FILE


/* ====================== FUNCTION ====================== */


export async function	loadHtml(path: string) {
	const response = await fetch(path);
	if (!response.ok) {
		return `<h1>Error ${response.status}</h1><p>Unable to load ${path}</p>`;
	}
	return await response.text();
}
