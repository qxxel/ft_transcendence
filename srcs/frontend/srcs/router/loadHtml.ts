/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loadHtml.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 11:01:20 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/17 21:38:37 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT LOAD HTML FILE


/* ====================== FUNCTION ====================== */

import axios from 'axios';

import type { AxiosResponse } from 'axios';


/* ====================== FUNCTION ====================== */


export async function	loadHtml(path: string) {
	try {
        const response: AxiosResponse = await axios.get(path, { responseType: 'text' });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return `<h1>Error ${error.response.status}</h1><p>Unable to load ${path}</p>`;
        }

        return `<h1>Error Network</h1><p>Unable to reach ${path}</p>`;
    }
}
