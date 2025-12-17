/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   privacyFilter.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 11:46:46 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 11:51:42 by agerbaud         ###   ########.fr       */
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