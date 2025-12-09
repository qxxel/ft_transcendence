/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   changeListener.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:46:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 14:44:03 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO ATTACH LISTENER OF CHANGES


/* ====================== IMPORTS ====================== */

import { sendRequest }			from "../utils/sendRequest"
import { setDynamicFavicon }	from "../utils/setDynamicFavicon"


/* ====================== FUNCTIONS ====================== */

export function attachAvatarUploadListener(userId: number) {
	const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;

	if (fileInput) {
		fileInput.addEventListener('change', async (event) => {
			const files: FileList | null = (event.target as HTMLInputElement).files;

			if (files && files.length > 0) {
				const	file = files[0];

				await uploadAvatar(userId, file);
			}
		});
	}
}

async function uploadAvatar(userId: number, file: File) {
	const formData = new FormData();
	formData.append('file', file);

	try {
		const	response = await sendRequest(`/api/user/avatar`, "POST", formData);
		if (!response.ok)
		{
			console.error('Upload error:', await response.text());
			console.error(response);					//	A CHANGER
			return ;
		}

		const data = await response.json();

		const imgElement = document.getElementById('user-avatar') as HTMLImageElement;
		if (imgElement)
			imgElement.src = `/uploads/${data.avatar}?t=${new Date().getTime()}`;

		setDynamicFavicon(data.avatar);
	} catch (err) {
		console.error('Network error:', err);
	}
}
