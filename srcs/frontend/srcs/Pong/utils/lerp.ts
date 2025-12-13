/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lerp.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/01 19:28:32 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 00:42:08 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL FUNCTIONS THAT STAND FOR SMOOTHING THE GAME


/* ====================== FUNCTION ====================== */

export function	linearInterpolation(start: number, end: number, smooth: number) {
	return start * (1 - smooth) + end * smooth;
}
