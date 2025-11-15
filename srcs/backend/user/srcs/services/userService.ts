/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:19:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/15 19:03:22 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// will be the logic of the who will call repositories functions


/* ====================== IMPORT ====================== */

import { userRepository }	from "../repositories/userRepository.js";
import { userAddDto }		from "../dtos/userAddDto.js";
import { isTaken }			from "../utils/validation.js";
import { userRespDto }		from "../dtos/userRespDto.js";

import { IsTakenError, NotExistError } 	from "../utils/throwErrors.js";


/* ====================== CLASS ====================== */

export class	userService {
	private	userRepo;

	constructor(userRepo: userRepository) {
		this.userRepo = userRepo;
	}

	async addUser(userAddDto: userAddDto): Promise<userRespDto> {
		
		const	nameQuery = `SELECT 1 FROM user WHERE username = ? LIMIT 1`;
		if (await isTaken(this.userRepo.getDb(), nameQuery, [userAddDto.getName()]))
			throw new IsTakenError(`The name ${userAddDto.getName()} is already taken. Try another one or sign in !`);

		const	emailQuery = `SELECT 1 FROM user WHERE email = ? LIMIT 1`;
		if (await isTaken(this.userRepo.getDb(), emailQuery, [userAddDto.getEmail()]))
			throw new IsTakenError(`The email ${userAddDto.getEmail()} is already use for another account. Try another one or sign in !`);

		const	id = await this.userRepo.addUser(userAddDto)
		return await this.getUserById(id);
	}


	async getUserById(userId: number): Promise<userRespDto> {
		const	existQuery = `SELECT 1 FROM user WHERE id = ? LIMIT 1`;
		if (!(await isTaken(this.userRepo.getDb(), existQuery, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		return await this.userRepo.getUserById(userId);
	}

	async getUserByIdentifier(identifier: string): Promise<userRespDto> {
		var	existQuery = `SELECT 1 FROM user WHERE username = ? LIMIT 1`;
		if (await isTaken(this.userRepo.getDb(), existQuery, [identifier]))
			return await this.userRepo.getUserByUsername(identifier);

		existQuery = `SELECT 1 FROM user WHERE email = ? LIMIT 1`;
		if (await isTaken(this.userRepo.getDb(), existQuery, [identifier]))
			return await this.userRepo.getUserByEmail(identifier);

		throw new NotExistError(`The user ${identifier} does not exist.`)
	}


	async deleteUser(userId: number): Promise<void> {
		console.log("2");
		const	existQuery = `SELECT 1 FROM user WHERE id = ? LIMIT 1`;
		if (!(await isTaken(this.userRepo.getDb(), existQuery, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);
		console.log("3");

		return await this.userRepo.deleteUser(userId);
	}
}
