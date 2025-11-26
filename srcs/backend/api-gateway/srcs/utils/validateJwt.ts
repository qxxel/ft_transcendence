/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validateJwt.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/24 22:08:37 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/24 22:51:43 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT VALIDATE JWT ACCESS TOKEN BEFORE ANY REQUEST


/* ====================== IMPORT ====================== */

import type { AxiosInstance, AxiosResponse }	from 'axios'
import type { FastifyRequest }					from 'fastify';


/* ====================== FUNCTION ====================== */

// export async function	validateJwt(gatewayAxios: AxiosInstance, request: FastifyRequest): number {
// 	const	response: AxiosResponse = await gatewayAxios.get('https://jwt:3000/validate',
// 		{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
// 	);

// 	return response.data.id;
// }