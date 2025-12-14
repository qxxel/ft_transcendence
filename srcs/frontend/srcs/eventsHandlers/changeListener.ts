/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   changeListener.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:46:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:07:29 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO ATTACH LISTENER OF CHANGES


/* ====================== IMPORTS ====================== */

import { appStore } 			from "../objects/store";
import { sendRequest }			from "../utils/sendRequest"


/* ====================== FUNCTIONS ====================== */

export function attachAvatarUploadListener(userId: number) {
	const	fileInput = document.getElementById('avatar-upload') as HTMLInputElement;

	if (fileInput) {
		fileInput.addEventListener('change', async (event) => {
			const	files: FileList | null = (event.target as HTMLInputElement).files;

			if (files && files.length > 0) {
				const	file = files[0];

				await uploadAvatar(userId, file);
			}
		});
	}
}

async function uploadAvatar(userId: number, file: File) {
	const	formData = new FormData();
	formData.append('file', file);

	try {
		const	response = await sendRequest(`/api/user/avatar`, "POST", formData);
		if (!response.ok)
		{
			console.error('Upload error:', await response.text());
			console.error(response);					//	A CHANGER
			return ;
		}

		const	data = await response.json();

		const	imgElement = document.getElementById('user-avatar') as HTMLImageElement;
		if (imgElement)
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
