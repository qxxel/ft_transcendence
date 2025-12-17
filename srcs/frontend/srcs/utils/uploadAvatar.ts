/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   uploadAvatar.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 14:03:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 14:50:25 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO UPLOAD AVATAR WHEN SUBMIT


/* ====================== IMPORTS ====================== */

import { AppState, appStore } 	from "../objects/store"
import { displayPop }			from "../utils/display"
import { sendRequest }			from "../utils/sendRequest"


/* ====================== FUNCTION ====================== */

export async function	uploadAvatar(): Promise<void> {
	const	state: AppState = appStore.getState();
	if (!state.user.pendingAvatar)
	{
		displayPop("No file uploaded to change avatar.", "error");
		return ;
	}

	const	formData: FormData = new FormData();
	formData.append('file', state.user.pendingAvatar);

	try {
		const	response: Response = await sendRequest(`/api/user/avatar`, "POST", formData);
		if (!response.ok)
		{
			displayPop(response, "error");
			return ;
		}

		const	data: any = await response.json();

		const	imgElement: HTMLElement | null = document.getElementById('user-avatar');
		if (imgElement instanceof HTMLImageElement)
			imgElement.src = `/uploads/${data.avatar}?t=${new Date().getTime()}`;
		else
			displayPop("Missing avatar HTMLElement!", "error");

		appStore.setState((state) => ({
			...state,
			user: {
				...state.user,
				avatar: data.avatar,
				pendingAvatar: null
			}
		}));

		displayPop("Avatar changed.", "success");
	} catch (err) {
		displayPop("Network error: " + err, "error");
	}
}
