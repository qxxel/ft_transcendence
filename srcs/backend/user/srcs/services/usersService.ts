/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 19:19:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/19 08:53:55 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// WILL BE THE LOGIC OF THE WHO WILL CALL USERS REPOSITORY FUNCTIONS


/* ====================== IMPORTS ====================== */

import { usersAddDto }		from "../dtos/usersAddDto.js"
import { usersRespDto }		from "../dtos/usersRespDto.js"
import { usersUpdateDto }	from "../dtos/usersUpdateDto.js"
import { usersRepository }	from "../repositories/usersRepository.js"

import { IsTakenError, NotExistError }	from "../utils/throwErrors.js"


/* ====================== CLASS ====================== */

export class	usersService {
	private	usersRepo: usersRepository;

	constructor(usersRepo: usersRepository) {
		this.usersRepo = usersRepo;
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

		throw new NotExistError(`This user does not exist`);
	}

	async getUserByEmail(userEmail: string): Promise<usersRespDto> {
		const	query: string = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
		if (await this.usersRepo.isTaken(query, [userEmail]))
			return await this.usersRepo.getUserByEmail(userEmail);

		throw new NotExistError(`This user does not exist`);
	}

	async isPossibleUpdateUser(userId: number, user: usersUpdateDto): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		const	username: string | undefined = user.getUsername();
		if (username !== undefined) {
			const	nameQuery: string = "SELECT 1 FROM users WHERE username = ? LIMIT 1";
			if (await this.usersRepo.isTaken(nameQuery, [username]))
				throw new IsTakenError(`The name ${username} is already taken. Try another one !`);
		}

		const	email: string | undefined = user.getEmail();
		if (email !== undefined)
		{
			const	nameQuery: string = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
			if (await this.usersRepo.isTaken(nameQuery, [email]))
				throw new IsTakenError(`The name ${email} is already taken. Try another one !`);
		}
	}

	async updateLogById(userId: number, isLog: boolean): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);
	
		return await this.usersRepo.updateLogById(userId, isLog);
	}

	async updateUserById(userId: number, user: usersUpdateDto): Promise<void> {
		await this.isPossibleUpdateUser(userId, user);
		
		if (user.getUsername() !== undefined)
			await this.usersRepo.updateUsernameById(userId, user.getUsername()!);
		
		if (user.getEmail() !== undefined)
			await this.usersRepo.updateEmailById(userId, user.getEmail()!);

		if (user.getAvatar() !== undefined)
			await this.updateAvatarById(userId, user.getAvatar()!);

		if (user.getIs2faEnable() !== undefined)
			await this.update2faById(userId, user.getIs2faEnable()!);

		return;
	}

	async updateUsernameById(userId: number, username: string): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		const	nameQuery: string = "SELECT 1 FROM users WHERE username = ? LIMIT 1";
		if (await this.usersRepo.isTaken(nameQuery, [username]))
			throw new IsTakenError(`The name ${username} is already taken. Try another one !`);
	
		return await this.usersRepo.updateUsernameById(userId, username);
	}

	async updateEmailById(userId: number, email: string): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		const	nameQuery: string = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
		if (await this.usersRepo.isTaken(nameQuery, [email]))
			throw new IsTakenError(`The name ${email} is already taken. Try another one !`);
	
		return await this.usersRepo.updateEmailById(userId, email);
	}

	async updateAvatarById(userId: number, avatar: string): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);
	
		return await this.usersRepo.updateAvatarById(userId, avatar);
	}

	async update2faById(userId: number, is2faEnable: boolean): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);
	
		return await this.usersRepo.update2faById(userId, is2faEnable);
	}

	async deleteUser(userId: number): Promise<void> {
		const	query: string = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
		if (!(await this.usersRepo.isTaken(query, [userId.toString()])))
			throw new NotExistError(`The user ${userId} does not exist`);

		return await this.usersRepo.deleteUser(userId);
	}
}
