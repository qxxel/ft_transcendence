/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 22:15:18 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/29 19:05:27 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// handle the get, post, and all the info that fastify receive

import { fastify, userRepo } from "../index.js";
import { userDto } from "../dtos/userDto.js";
import { userRepository } from "../tableRepositories/userRepository.js";

fastify.get('/user/:id', async (request, reply) => {
	const { id } = request.params as { id: string };
	const parseId = parseInt(id, 10);

	try {
		return (userRepo.getUserById(parseId));
	}
	catch (err) {
		reply.code(400);
		return err;
	}
});

fastify.post('/user', async (request, reply) => {
	if (!request.body)
	{
		reply.code(400);
		return "The request is empty";
	}

	try {
		const	newUser = new userDto(request.body);
		const	userId = userRepo.addUser(newUser);

		reply.code(201);
		return "user created at id: [" + userId.toString() + "]";
	}
	catch (err) {
		reply.code(400);
		return err;
	}
});
