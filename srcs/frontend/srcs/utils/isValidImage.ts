/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   isValidImage.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 14:47:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/18 03:45:38 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO SEE IF AN IMAGE IS VALID


/* ====================== IMPORT ====================== */

import { displayPop }	from "./display"


/* ====================== FUNCTION ====================== */

export function	isValidImage(file: File): Promise<boolean> {
	return new Promise((resolve) => {
		const	validMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'];
		if (!validMimeTypes.includes(file.type))
		{
			displayPop("Invalid file type. Only JPG, PNG, WEBP allowed.", "error");
			resolve(false);
			return;
		}

		const url = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(true);
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			displayPop("Invalid file type. Only valid images allowed.", "error");
			resolve(false);
		};

		img.src = url;
	});
}