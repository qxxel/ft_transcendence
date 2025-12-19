/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   isValidImage.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 14:47:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:25:53 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION TO SEE IF AN IMAGE IS VALID


/* ====================== IMPORT ====================== */

import { displayPop }	from "./display.js"


/* ====================== FUNCTION ====================== */

export function	isValidImage(file: File): Promise<boolean> {
	return new Promise((resolve) => {
		const	validMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'];
		if (!validMimeTypes.includes(file.type))
		{
			displayPop("error", "id-error", "Invalid file type. Only JPG, PNG, WEBP allowed.");
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
			displayPop("error", "id-error", "Invalid file type. Only valid images allowed.");
			resolve(false);
		};

		img.src = url;
	});
}