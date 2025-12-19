/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   isValidImage.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 14:47:29 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:26:04 by kiparis          ###   ########.fr       */
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
			displayPop("error", "Invalid file type. Only JPG, PNG, WEBP allowed.");
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
			displayPop("error", "Invalid file type. Only valid images allowed.");
			resolve(false);
		};

		img.src = url;
	});
}