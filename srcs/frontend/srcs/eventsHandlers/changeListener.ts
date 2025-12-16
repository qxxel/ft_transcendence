/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   changeListener.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:46:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 16:18:29 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO ATTACH LISTENER OF CHANGES


/* ====================== IMPORTS ====================== */

import { appStore } 			from "../objects/store";
import { displayPop } from "../utils/display";
import { sendRequest }			from "../utils/sendRequest"


/* ====================== FUNCTIONS ====================== */

export function attachAvatarUploadListener(userId: number) {
	const	fileInput: HTMLElement | null = document.getElementById('avatar-upload') as HTMLInputElement;

	if (fileInput instanceof HTMLInputElement) {
		fileInput.addEventListener('change', async (event) => {
			const	files: FileList | null = (event.target as HTMLInputElement).files;

			if (files && files.length > 0) {
				const	file = files[0];

				await uploadAvatar(userId, file);
			}
		});
	}
}

async function uploadAvatar(userId: number, file: File) { // userId not use ???
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
