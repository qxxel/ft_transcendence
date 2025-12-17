/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   changeListener.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:46:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/17 04:16:35 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO ATTACH LISTENER OF CHANGES


/* ====================== IMPORTS ====================== */

import { appStore } 			from "../objects/store";
import { displayPop } from "../utils/display";
import { sendRequest }			from "../utils/sendRequest"


/* ====================== FUNCTIONS ====================== */

export function attachAvatarUploadListener(userId: number): void {
	const	fileInput: HTMLElement | null = document.getElementById('avatar-upload');
	if (!(fileInput instanceof HTMLInputElement)) {
		displayPop("Missing avatar HTMLElement!", "error");
		return ;
	}

	fileInput.addEventListener('change', async (event) => {
		const	files: FileList | null = (event.target as HTMLInputElement).files;

		if (files && files.length > 0) {
			const	file = files[0];

			await uploadAvatar(userId, file);
		}
	});
}

async function uploadAvatar(userId: number, file: File): Promise<void> { // userId not use ???
	const	formData: FormData = new FormData();
	formData.append('file', file);

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
			}
		}));
	} catch (err) {
		displayPop("Network error: " + err, "error");
	}
}
