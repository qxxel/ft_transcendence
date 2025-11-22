/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsAddDto.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 17:48:22 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 14:00:43 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM CONTROLLER TO DB FOR NEW FRIENDSHIPS


/* ====================== CLASS ====================== */

export class	friendshipsAddDto {
	private	requesterId: number;
	private	receiverId: number;


	constructor(row: any) {
		this.requesterId = row.requesterId;
		this.receiverId = row.receiverId;
	}


	getTable(): [number, number] {
		return [
			this.requesterId,
			this.receiverId
		];
	}
}
