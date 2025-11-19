/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtRespDto.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:30:14 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 16:07:10 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW USERS


/* ====================== class	====================== */

export class	jwtRespDto {
	private	id: number;
	private	clientId: number;
	private	token: string;
	private	creationTime: number;


	constructor(row: any) {
		this.id = row.id;
		this.clientId = row.idclient;
		this.token = row.token;
		this.creationTime = row.creationtime;
	}


	// GETTERS
	getId(): number {
		return this.id;
	}

	getClientId(): number {
		return this.clientId;
	}

	getToken(): string {
		return this.token;
	}

	getCreationTime(): number {
		return this.creationTime;
	}
}
