/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   interface.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/12 23:19:56 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/15 02:52:36 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE ALL TYPE DEFINITIONS FOR USER AUTHENTICATION


/* ====================== INTERFACES ====================== */

export interface	SignUpBody {
	username: string;
	email: string;
	password: string;
};

export interface	SignInBody {
	identifier: number;
	password: string;
}

export interface	user {
	username?: string;
	email?: string;
	avatar?: string;
	is2faEnable?: boolean;
}

export interface	updateUserBody {
	otp?: string;
	password: string;
	user: user;
}

export interface	usersRespDto {
	id: number;
	username: string;
	email: string;
	avatar: string | null;
	is2faEnable: boolean;
}