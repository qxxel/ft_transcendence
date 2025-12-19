/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   safeFunction.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/19 03:40:34 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:57:52 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/* ====================== FUNCTION ====================== */

export function safeCreateElement(tag: string): HTMLElement | unknown {
	if (!(document instanceof Document))
		return "Cannot create element; document is not available.";
	
	try {
		return document.createElement(tag);
	} catch (error: unknown) {
		return error;
	}
}