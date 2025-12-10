/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersRespDto.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 20:33:06 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/09 14:38:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR USERS


/* ====================== CLASS ====================== */

export class	usersRespDto {
	private	id: number;
	private	username: string;
	private	email: string;
	private	avatar: string | null;
	private	is2faEnable: boolean;


	constructor(row: any) {
		this.id = row.id;
		this.username = row.username;
		this.email = row.email;
		this.avatar = row.avatar;
		this.is2faEnable = row.is_2fa_enable;
	}


	// GETTERS
	getTable(): [number, string, string, string | null, boolean] {
		return [
			this.id,
			this.username,
			this.email,
			this.avatar,
			this.is2faEnable
		];
	}

	getId(): number {
		return this.id;
	}

	getEmail(): string {
		return this.email;
	}

	getUsername(): string {
		return this.username;
	}

	getAvatar(): string | null {
		return this.avatar;
	}

	getIs2faEnable(): boolean {
		return this.is2faEnable;
	}
}
