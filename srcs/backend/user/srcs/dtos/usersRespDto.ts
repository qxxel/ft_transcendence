/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersRespDto.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:33:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:21:57 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR USERS


/* ====================== CLASS ====================== */

export class	usersRespDto {
	private	id: number;
	private	username: string;
	private	email: string;
	private	avatar: string;
	private	is2faEnable: boolean;


	constructor(row: any) {
		this.id = row.id;
		this.username = row.username;
		this.email = row.email;
		this.avatar = row.avatar;
		this.is2faEnable = row.is2faEnable;
	}


	// GETTERS
	getTable(): [number, string, string, string, boolean] {
		return [
			this.id,
			this.username,
			this.email,
			this.avatar,
			this.is2faEnable
		];
	}

	// getId(): number {
	// 	return this.id;
	// }

	// getName(): string {
	// 	return this.username;
	// }

	// getEmail(): string {
	// 	return this.email;
	// }

	// getElo(): number {
	// 	return this.elo;
	// }
}
