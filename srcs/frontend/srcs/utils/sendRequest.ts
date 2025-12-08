/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sendRequest.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/18 18:23:51 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 00:47:26 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// IT'S THE FUNCTION THAT HANDLE ALL THE REQUESTS TO THE BACKEND


/* ====================== FUNCTION ====================== */

async function	sendMainRequest(path: string, requestMethod: string, body: any | null): Promise<Response> {
	let	response: Response;

	if (body === null)
	{
		response = await fetch(path, {
			method: requestMethod,
			credentials: "include"
		});
	}
	else if (body instanceof FormData)
    {
        response = await fetch(path, {
			method: requestMethod,
			credentials: "include",
            body: body 
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
