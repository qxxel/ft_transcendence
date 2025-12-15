/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   quickmaths.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 17:36:58 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:35:32 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// UTILITY FUNCTION THAT CONVERTS DEGREES TO RADIANS


/* ============================= FUNCTION ============================= */

export function deg2rad(degrees: number):number {
	return degrees * (Math.PI/180);
}
