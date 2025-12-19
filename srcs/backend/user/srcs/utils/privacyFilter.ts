/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   privacyFilter.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 11:46:46 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:54:17 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// THE FUNCTION THAT REMOVE SENSITIVE INFORMATIONS OF THE RESPONSE

import type { usersRespDto } from "../dtos/usersRespDto.js";

export function	privacyFilter(user: usersRespDto): Object {
	return {
		id: user.getId(),
		username: user.getUsername(),
		avatar: user.getAvatar()
	}
}