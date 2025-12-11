/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwtRespDto.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:30:14 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 18:36:51 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW USERS


/* ====================== CLASS ====================== */

export class	jwtRespDto {
	private	id: number;
	private	clientId: number;
	private	token: string;
	private	creationTime: number;
	private	expirationTime: number;


	constructor(row: any) {
		this.id = row.id;
		this.clientId = row.idclient;
		this.token = row.token;
		this.creationTime = row.created_at;
		this.expirationTime = row.expires_at;
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

	getExpirationTime(): number {
		return this.expirationTime;
	}
}
