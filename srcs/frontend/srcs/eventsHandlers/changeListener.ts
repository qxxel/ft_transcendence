/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   changeListener.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:46:24 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:25:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO ATTACH LISTENER OF CHANGES


/* ====================== IMPORTS ====================== */

import { appStore }		from "../objects/store"
import { displayPop }	from "../utils/display"
import { isValidImage }	from "../utils/isValidImage"


/* ====================== FUNCTION ====================== */

export function attachAvatarUploadListener(userId: number): void {
	const	fileInput: HTMLElement | null = document.getElementById('avatar-upload');
	if (!(fileInput instanceof HTMLInputElement))
	{
		displayPop("error", "id-error", "Missing avatar HTMLElement!");
		return;
	}
	const	imgElement: HTMLElement | null = document.getElementById('user-avatar');
	if (!(imgElement instanceof HTMLImageElement))
		{
			displayPop("error", "id-error", "Missing avatar HTMLElement!");
			return;
		}
		
		fileInput.addEventListener('change', async (event) => {
			const	files: FileList | null = (event.target as HTMLInputElement).files;
	
			if (files && files.length > 0) {
				const	file: File = files[0];

				if (!(await isValidImage(file)))
				{
					appStore.setState((state) => ({
						...state,
						user: {
							...state.user,
							pendingAvatar: null
						}
					}));
					return;
				}

				appStore.setState((state) => ({
					...state,
					user: {
						...state.user,
						pendingAvatar: file
					}
				}));

				const	reader: FileReader = new FileReader();

				reader.onload = (event: ProgressEvent<FileReader>) => {
					if (event.target?.result) {
						imgElement.src = event.target.result as string;
					}
				};

				reader.readAsDataURL(file);
			}
	});
}
