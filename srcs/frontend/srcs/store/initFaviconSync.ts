/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   initFaviconSync.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 15:51:37 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 10:05:47 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT SETUP THE SUBSCRIBE TO STORE FOR CHANGE FAVICON WHEN CHANGING AVATAR


/* ====================== IMPORTS ====================== */

import { appStore, AppState }	from "../objects/store.js"
import { setDynamicFavicon }	from "../utils/setDynamicFavicon.js"


/* ====================== FUNCTION ====================== */

export function	initFaviconSync(): void {
	let	lastAvatarUrl: string | null = null; 

	appStore.subscribe((state: AppState) => {
		if (!state.user)
			return ;

		const	currentUrl: string | null = state.user.avatar;

		if (currentUrl !== lastAvatarUrl)
		{
			setDynamicFavicon(currentUrl);

			lastAvatarUrl = currentUrl;
		}
	});
}
