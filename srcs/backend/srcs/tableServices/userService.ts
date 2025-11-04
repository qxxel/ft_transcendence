/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:16:40 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/04 16:12:44 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// will be the logic of the who will call repositories functions


/* ====================== IMPORT ====================== */

import { userRepository } from "../tableRepositories/userRepository.js";
import { userDto } from "../dtos/userDto.js";
import { isTaken } from "../utils/validation.js"

/* ====================== CLASS ====================== */

export class	userService {
	private	userRepo;

	constructor(userRepo: userRepository) {
		this.userRepo = userRepo;
	}

	async addUser(userDto: userDto): Promise<userDto> {
		const	nameQuery = `SELECT 1 FROM user WHERE username = ? LIMIT 1`
		if (await isTaken(this.userRepo.getDb(), nameQuery, [userDto.getName()]))
			throw new Error(`The name ${userDto.getName()} is already taken. Try another one !`);

		const	emailQuery = `SELECT 1 FROM user WHERE email = ? LIMIT 1`
		if (await isTaken(this.userRepo.getDb(), emailQuery, [userDto.getEmail()]))
			throw new Error(`The email ${userDto.getEmail()} is already use for another account. Try to sign in !`);

		const	id = await this.userRepo.addUser(userDto)
		return await this.getUserById(id);
	}

	async getUserById(userId: number): Promise<userDto> {
		const	existQuery = `SELECT 1 FROM user WHERE user = ? LIMIT 1`;
		if (!(await isTaken(this.userRepo.getDb(), existQuery, [userId.toString()])))
			throw new Error(`The user ${userId} does not exist`);

		return await this.userRepo.getUserById(userId);
	}

	async getUserByIdentifier(identifier: string): Promise<userDto> {
		var	existQuery = `SELECT 1 FROM user u WHERE u.username = ? LIMIT 1`;
		if (await isTaken(this.userRepo.getDb(), existQuery, [identifier]))
			return await this.userRepo.getUserByUsername(identifier);

		const	emailQuery = `SELECT 1 FROM user u WHERE u.email = ? LIMIT 1`;
		if (await isTaken(this.userRepo.getDb(), existQuery, [identifier]))
			return await this.userRepo.getUserByEmail(identifier);

		throw new Error(`The user ${identifier} does not exist.`)
	}


	async deleteUser(userId: number): Promise<void> {
		const	existQuery = `SELECT 1 FROM user WHERE user = ? LIMIT 1`;
		if (!(await isTaken(this.userRepo.getDb(), existQuery, [userId.toString()])))
			throw new Error(`The user ${userId} does not exist`);

		return await this.userRepo.deleteUser(userId);
	}
}
