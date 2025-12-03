/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   smooth.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/01 19:28:32 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/01 19:48:47 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ALL FUNCTIONS THAT STAND FOR SMOOTHING THE GAME


/* ====================== FUNCTION ====================== */

export function	linearInterpolation(start: number, end: number, smooth: number) {
	return start * (1 - smooth) + end * smooth;
}
