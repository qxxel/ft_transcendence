/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:19:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/21 17:23:39 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL USERS REPOSITORY FUNCTIONS


/* ====================== IMPORTS ====================== */

import { usersAddDto }		from "../dtos/usersAddDto.js"
import { usersRepository }	from "../repositories/usersRepository.js"
import { usersRespDto }		from "../dtos/usersRespDto.js"

import { IsTakenError, NotExistError }	from "../utils/throwErrors.js"


/* ====================== CLASS ====================== */

export class	usersService {
	private	usersRepo: usersRepository;

	constructor(userRepo: usersRepository) {
		this.usersRepo = userRepo;
	}

	async addUser(user: usersAddDto): Promise<usersRespDto> {
		const	nameQuery: string = "SELECT 1 FROM users WHERE username = ? LIMIT 1";
		if (await this.usersRepo.isTaken(nameQuery, [user.getName()]))
			throw new IsTakenError(`The name ${user.getName()} is already taken. Try another one or sign in !`);

		const	emailQuery: string = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
		if (await this.usersRepo.isTaken(emailQuery, [user.getEmail()]))
			throw new IsTakenError(`The email ${user.getEmail()} is already use for another account. Try another one or sign in !`);

		const	id: number = await this.usersRepo.addUser(user)
		return await this.getUserById(id);
	}

	async getUserById(userId: number): Promise<usersRespDto> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		return await this.usersRepo.getUserById(userId);
	}

	async getUserByUsername(username: string): Promise<usersRespDto> {
		const	query: string = "SELECT 1 FROM users WHERE username = ? LIMIT 1";
		if (await this.usersRepo.isTaken(query, [username]))
			return await this.usersRepo.getUserByUsername(username);

		throw new NotExistError(`The user with username ${username} does not exist`);
	}

	async getUserByEmail(userEmail: string): Promise<usersRespDto> {
		const	query: string = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
		if (await this.usersRepo.isTaken(query, [userEmail]))
			return await this.usersRepo.getUserByEmail(userEmail);

		throw new NotExistError(`The user with email ${userEmail} does not exist`);
	}

	async deleteUser(userId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		return await this.usersRepo.deleteUser(userId);
	}
}
