/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendshipsRespDto.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/21 18:20:19 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/22 14:00:31 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE DTO TO TRANSFERT DATA FROM DB TO REPOSITORY FOR FRIENDSHIPS


/* ====================== CLASS ====================== */

export class	friendshipsRespDto {
	private	id: number;
	private	requesterId: number;
	private	receiverId: number;
	private	status: string;
	private	createdAt: number;


	constructor(row: any) {
		this.id = row.id;
		this.requesterId = row.requester_id;
		this.receiverId = row.receiver_id;
		this.status = row.status;
		this.createdAt = row.created_at;
	}


	getTable(): [number, number, number, string, number] {
		return [
			this.id,
			this.requesterId,
			this.receiverId,
			this.status,
			this.createdAt
		];
	}
}
