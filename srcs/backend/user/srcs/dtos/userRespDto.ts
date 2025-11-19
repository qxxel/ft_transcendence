/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRespDto.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:33:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:07:10 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW USERS


/* ====================== class	====================== */

export class	userRespDto {
	private	id: number;
	private	username: string;
	private	email: string;
	private	elo: number;


	constructor(row: any) {
		this.id = row.id;
		this.username = row.username;
		this.email = row.email;
		this.elo = row.elo;
	}


	// GETTERS
	getId(): number {
		return this.id;
	}

	getName(): string {
		return this.username;
	}

	getEmail(): string {
		return this.email;
	}

	getElo(): number {
		return this.elo;
	}
}
