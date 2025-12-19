/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   safeFunction.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/19 03:40:34 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 04:08:02 by mreynaud         ###   ########.fr       */
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