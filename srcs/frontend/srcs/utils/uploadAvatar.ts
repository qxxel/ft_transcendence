/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   uploadAvatar.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 14:03:54 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:31:45 by mreynaud         ###   ########.fr       */
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
		displayPop("error", "No file uploaded to change avatar.");
		return;
	}

	const	formData: FormData = new FormData();
	formData.append('file', state.user.pendingAvatar);

	try {
		const	response: Response = await sendRequest(`/api/user/avatar`, "POST", formData);
		if (!response.ok)
		{
			displayPop("error", response);
			return;
		}

		const	data: any = await response.json();

		const	imgElement: HTMLElement | null = document.getElementById('user-avatar');
		if (imgElement instanceof HTMLImageElement)
			imgElement.src = `/uploads/${data.avatar}?t=${new Date().getTime()}`;
		else
			displayPop("error", "Missing avatar HTMLElement!");

		appStore.setState((state) => ({
			...state,
			user: {
				...state.user,
				avatar: data.avatar,
				pendingAvatar: null
			}
		}));

		displayPop("error", "Avatar changed.", "success");
	} catch (error: unknown) {
		displayPop("error", "Network error: " + error);
	}
}
