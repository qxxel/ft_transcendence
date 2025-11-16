/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/15 23:43:33 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/15 23:44:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE AUTH REPOSITORY


/* ====================== IMPORT ====================== */

import { authRepository }	from "../repositories/authRepository.js"


/* ====================== CLASS ====================== */

export class	authService {
	private	authRepo;

	constructor(authRepo: authRepository) {
		this.authRepo = authRepo;
	}
}
