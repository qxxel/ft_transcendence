/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sendRequest.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/18 18:23:51 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/06 18:25:17 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// IT'S THE FUNCTION THAT HANDLE ALL THE REQUESTS TO THE BACKEND


/* ====================== FUNCTION ====================== */

async function	sendMainRequest(path: string, requestMethod: string, body: Object | null): Promise<Response> {
	let	response: Response;

	if (body === null)
	{
		response = await fetch(path, {
			method: requestMethod,
			credentials: "include"
		});
	}
	else
	{
		response = await fetch(path, {
			method: requestMethod,
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});
	}

	return response;
}

export async function	sendRequest(path: string, requestMethod: string, body: Object | null): Promise<Response> {
	
	let response: Response = await sendMainRequest(path, requestMethod, body);
	
	if (response.status === 401){
		response = await fetch("/api/jwt/refresh/access", {
			method: "POST",
			credentials: "include",
		});
		
		if (response.ok)
			response = await sendMainRequest(path, requestMethod, body);
	}
	return response;
}
