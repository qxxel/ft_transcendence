/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   isLog.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/12 23:29:16 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:53:40 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// CHECK IF A USER IS LOGGED IN VIA AUTH SERVICE


/* ====================== IMPORTS ====================== */
import axios			from 'axios'
import { authAxios }	from "../auth.js"

import type	{ AxiosResponse }   from 'axios'

/* ====================== FUNCTION ====================== */

export async function isLoggedIn(cookie: string | undefined): Promise<boolean> {
    try {
        const	res: AxiosResponse = await authAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: cookie || "" } });

        return (res.status === 200);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401)
                return false;
        }

        throw err;
    }
}