/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lerp.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/01 19:28:32 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 05:57:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL FUNCTIONS THAT STAND FOR SMOOTHING THE GAME


/* ====================== FUNCTION ====================== */

export function	linearInterpolation(start: number, end: number, smooth: number): number {
	return start * (1 - smooth) + end * smooth;
}
