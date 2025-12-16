/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   changeListener.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:46:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/15 05:29:59 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO ATTACH LISTENER OF CHANGES


/* ====================== IMPORTS ====================== */

import { appStore } 			from "../objects/store";
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
			console.error('Upload error:', await response.text());
			console.error(response);					//	A CHANGER
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
		console.error('Network error:', err);
	}
}
