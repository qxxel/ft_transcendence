/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameClass.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/20 23:23:06 by kiparis           #+#    #+#             */
/*   Updated: 2025/12/14 00:41:30 by kiparis          ###   ########.fr       */
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