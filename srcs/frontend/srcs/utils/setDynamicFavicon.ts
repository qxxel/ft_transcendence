/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   setDynamicFavicon.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 14:30:39 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 12:21:32 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTIONS THAT CHANGE THE FAVICON WHEN THE AVATAR CHANGE


/* ====================== FUNCTION ====================== */

// export function	seDynamicFavicon(path: string | null): void {
// 	let	link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");

// 	if (!link)
// 	{
// 		link = document.createElement('link');
// 		link.rel = 'icon';
// 		document.getElementsByTagName('head')[0].appendChild(link);
// 	}

// 	if (path)
// 		link.href = "/uploads/" + path;
// 	else
// 		link.href = "/uploads/default_avatar.png";

// 	// document.getElementsByTagName('head')[0].removeChild(link);
// 	// document.getElementsByTagName('head')[0].appendChild(link);
// }

export function	setDynamicFavicon(path: string | null): void {
	const	canvas: HTMLCanvasElement = document.createElement('canvas');
	const	ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
	const	img = new Image();

	img.crossOrigin = "Anonymous"; 

	img.onload = () => {
		const	size: number = 64; 
		canvas.width = size;
		canvas.height = size;

		ctx?.beginPath();
		ctx?.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
		ctx?.closePath();
		ctx?.clip();

		ctx?.drawImage(img, 0, 0, size, size);

		const	dataUrl: string = canvas.toDataURL('image/png');

		let	link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
		if (!link)
		{
			link = document.createElement('link');
			link.rel = 'icon';
			document.getElementsByTagName('head')[0].appendChild(link);
		}

		link.href = dataUrl;
	};

	img.src = path ? "/uploads/" + path : "/assets/default_avatar.png";
}
