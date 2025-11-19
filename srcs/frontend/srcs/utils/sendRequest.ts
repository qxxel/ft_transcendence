/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sendRequest.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/18 18:23:51 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/18 18:47:39 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// IT'S THE FUNCTION THAT HANDLE ALL THE REQUESTS TO THE BACKEND


/* ====================== IMPORT ====================== */




/* ====================== FUNCTION ====================== */

export async function	sendRequest(path: string, requestMethod: string, body: Object | null): Promise<Response> {
	if (body === null)
	{
		var	response: Response = await fetch(path, {
			method: requestMethod,
			credentials: "include"
		});
	}
	else
	{
		var	response: Response = await fetch(path, {
			method: requestMethod,
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});
	}

	if (response.status === 401){
		response = await fetch("/api/jwt/refresh", {
			method: "GET",
			credentials: "include",
		});
	}

	return response;
}
