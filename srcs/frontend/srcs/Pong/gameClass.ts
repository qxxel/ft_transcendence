/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameClass.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:23:06 by kiparis           #+#    #+#             */
/*   Updated: 2025/12/15 02:43:54 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ABSTRACT CLASS FOR ALL GAMES


/* ====================== CLASS ====================== */

export class	Game {

	constructor() {}

	setCtx() {}
	start() {}
	setWinningScore(newWinningScore: number) {}
	stop() {}
}