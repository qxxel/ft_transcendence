/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:40:16 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/16 19:47:21 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE GET, POST, AND ALL THE INFO THAT USER SERVICE RECEIVE FOR USERS TABLE


/* ====================== IMPORTS ====================== */

import fs									from 'fs'
import { unlink }							from 'fs/promises'
import { pipeline }							from 'stream/promises'
import { userAxios, usersServ } 			from "../user.js"
import { usersAddDto }						from "../dtos/usersAddDto.js"
import { InvalidFileError, NoFileError }	from "../utils/throwErrors.js"
import { usersRespDto }						from "../dtos/usersRespDto.js"
import { errorsHandler }					from "../utils/errorsHandler.js"
import { usersUpdateDto }					from "../dtos/usersUpdateDto.js"
import { extractUserId }					from "../utils/extractHeaders.js"

import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'
import type { AxiosResponse } 									from 'axios'


interface	userUpdate {
	username?: string;
	email?: string;
	avatar?: string;
	is2faEnable?: boolean;
}

/* ====================== FUNCTION ====================== */

export async function	usersController(userFastify: FastifyInstance): Promise<void> {
	// GET A USER WITH HIS ID
	userFastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: number = extractUserId(request);

			const	user: usersRespDto = await usersServ.getUserById(userId);

			return reply.code(200).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// userFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
	// 	const	{ id } = request.params as { id: string };
	// 	const	parseId: number = parseInt(id, 10);
		
	// 	try {
	// 		const	user: usersRespDto = await usersServ.getUserById(parseId);
	// 		console.log("B2")

	// 		return reply.code(200).send(user);
	// 	}
	// 	catch (err: unknown) {
	// 		return errorsHandler(userFastify, reply, err);
	// 	}
	// });

	// GET A USER WITH AN IDENTIFIER (EMAIL OR USERNAME)
	userFastify.get('/lookup/:identifier', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ identifier } = request.params as { identifier: string };

			let	user: usersRespDto;
			if (!identifier.includes("@"))
				user = await usersServ.getUserByUsername(identifier);
			else
				user = await usersServ.getUserByEmail(identifier);

			return reply.code(200).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// ADD A USER
	userFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body)
		{
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	newUser: usersAddDto = new usersAddDto(request.body);
			const	user: usersRespDto = await usersServ.addUser(newUser);

			return reply.code(201).send(user);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// UPDATE A log WITH HIS ID
	userFastify.post<{ Body: { isLog: boolean } }>('/log', async (request: FastifyRequest<{ Body: { isLog: boolean } }>, reply: FastifyReply) => {
		if (!request.body) {
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}
		try {
			const	userId: number = extractUserId(request);

			await usersServ.updateLogById(userId, request.body.isLog);

			return reply.code(201).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// IS UPDATED USER WITH HIS ID
	userFastify.post<{ Body: userUpdate }>('/me/validate', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body) {
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}
		try {
			const	userId: number = extractUserId(request);

			const	oldUser: usersRespDto = await usersServ.getUserById(userId);
			const	userUpdate: usersUpdateDto = await new usersUpdateDto(request.body, oldUser);

			await usersServ.isPossibleUpdateUser(userId, userUpdate);

			return reply.code(201).send({ valid: true });
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// UPDATE A USER WITH HIS ID
	userFastify.patch<{ Body: userUpdate }>('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.body) {
			userFastify.log.error("The request is empty");
			console.error("The request is empty");
			return reply.code(400).send({ error: "The request is empty" });
		}

		try {
			const	userId: number = extractUserId(request);

			const	oldUser: usersRespDto = await usersServ.getUserById(userId);
			const	userUpdate: usersUpdateDto = await new usersUpdateDto(request.body, oldUser);

			await usersServ.updateUserById(userId, userUpdate);

			return reply.code(201).send(userId);
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// ADD A AVATAR
	userFastify.post('/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await userAxios.get('http://jwt:3000/payload/access',
				{ withCredentials: true, headers: { Cookie: request.headers.cookie || "" } }
			);

			const	userId: number = response.data.id;
			
			const	data = await request.file();
			if (!data)
				throw new NoFileError("No file uploaded.");

			const	validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
			if (!validMimeTypes.includes(data.mimetype))
				throw new InvalidFileError("Invalid file type. Only JPG, PNG, WEBP allowed.");

			try {
				const	currentUser = await usersServ.getUserById(userId);
				const	oldAvatar = currentUser.getAvatar();

				if (oldAvatar) {
					const	oldPath = `/app/uploads/${oldAvatar}`;

					await fs.promises.access(oldPath, fs.constants.F_OK);
					await unlink(oldPath);
				}
			} catch (err) {
				console.error("Error retrieving user for avatar deletion", err);
			}

			const	extension = data.filename.split('.').pop();
			const	fileName = `avatar_${userId}_${Date.now()}.${extension}`;
			const	uploadPath = `/app/uploads/${fileName}`;

			await pipeline(data.file, fs.createWriteStream(uploadPath));

			await usersServ.updateAvatarById(userId, fileName);

			return reply.code(200).send({ avatar: fileName });
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});

	// DELETE A USER WITH HIS ID
	userFastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			await usersServ.deleteUser(parseId);

			return reply.code(204).send();
		}
		catch (err: unknown) {
			return errorsHandler(userFastify, reply, err);
		}
	});
}
