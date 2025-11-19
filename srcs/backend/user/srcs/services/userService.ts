/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:19:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:49:22 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL REPOSITORIES FUNCTIONS


/* ====================== IMPORTS ====================== */

import { userAddDto }		from "../dtos/userAddDto.js"
import { userRepository }	from "../repositories/userRepository.js"
import { userRespDto }		from "../dtos/userRespDto.js"

import { IsTakenError, NotExistError }	from "../utils/throwErrors.js"


/* ====================== CLASS ====================== */

export class	userService {
	private	userRepo: userRepository;

	constructor(userRepo: userRepository) {
		this.userRepo = userRepo;
	}

	async addUser(userAddDto: userAddDto): Promise<userRespDto> {
		const	nameQuery: string = "SELECT 1 FROM user WHERE username = ? LIMIT 1";
		if (await this.userRepo.isTaken(nameQuery, [userAddDto.getName()]))
			throw new IsTakenError(`The name ${userAddDto.getName()} is already taken. Try another one or sign in !`);

		const	emailQuery: string = "SELECT 1 FROM user WHERE email = ? LIMIT 1";
		if (await this.userRepo.isTaken(emailQuery, [userAddDto.getEmail()]))
			throw new IsTakenError(`The email ${userAddDto.getEmail()} is already use for another account. Try another one or sign in !`);

		const	id: number = await this.userRepo.addUser(userAddDto)
		return await this.getUserById(id);
	}

	async getUserById(userId: number): Promise<userRespDto> {
		const	query: string = "SELECT 1 FROM user WHERE id = ? LIMIT 1";
		if (!(await this.userRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		return await this.userRepo.getUserById(userId);
	}

	async getUserByUsername(username: string): Promise<userRespDto> {
		const	query: string = "SELECT 1 FROM user WHERE username = ? LIMIT 1";
		if (await this.userRepo.isTaken(query, [username]))
			return await this.userRepo.getUserByUsername(username);

		throw new NotExistError(`The user with username ${username} does not exist`);
	}

	async getUserByEmail(userEmail: string): Promise<userRespDto> {
		const	query: string = "SELECT 1 FROM user WHERE email = ? LIMIT 1";
		if (await this.userRepo.isTaken(query, [userEmail]))
			return await this.userRepo.getUserByEmail(userEmail);

		throw new NotExistError(`The user with email ${userEmail} does not exist`);
	}

	async deleteUser(userId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM user WHERE id = ? LIMIT 1";
		if (!(await this.userRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		return await this.userRepo.deleteUser(userId);
	}
}
