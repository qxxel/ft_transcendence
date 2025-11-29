/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gatewayUserController.ts                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/16 14:24:56 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/29 15:52:12 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE THE ALL THE REQUEST THAT API GATEWAY RECEIVE FROM `/api/user`


/* ====================== IMPORTS ====================== */

import { gatewayAxios }			from "../api-gateway.js"
import { getValidUserId }		from "../utils/validateJwt.js"
import { requestErrorsHandler }	from "../utils/requestErrors.js"

import type { AxiosHeaderValue, AxiosResponse }  									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'


/* ====================== FUNCTION ====================== */

export async function	gatewayUserController(gatewayFastify: FastifyInstance): Promise<void> {
	/* =========== DEFAULT USER ROUTE =========== */

	// USERS MANAGEMENT
	gatewayFastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {						//
		try {																								//
			const	response: AxiosResponse = await gatewayAxios.post('https://user:3000/', request.body);	//
																											//
			return reply.send(response.data);																//	A ENLEVER POUR LEXTERIEUR
		} catch (err: unknown) {																			//
			return requestErrorsHandler(gatewayFastify, reply, err);										//
		}																									//
	});																										//

	gatewayFastify.patch('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.patch(`https://user:3000/me`, request.body,
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.post('/:id', async (request: FastifyRequest, reply: FastifyReply) => {								//
		const	{ id } = request.params as { id: string };																//
		const	parseId: number = parseInt(id, 10);																		//
																														//
		try {																											//
			const	response: AxiosResponse = await gatewayAxios.post(`https://user:3000/${parseId}`, request.body);	//	MATHIS: A ENLEVER
																														//
			return reply.send(response.data);																			//
		} catch (err: unknown) {																						//
			return requestErrorsHandler(gatewayFastify, reply, err);													//
		}																												//
	});																													//

	// USERS GETTERS
	gatewayFastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	response: AxiosResponse = await gatewayAxios.get('https://user:3000/');

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	response: AxiosResponse = await gatewayAxios.get(`https://user:3000/${parseId}`);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	// DELETE USER
	gatewayFastify.delete('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.delete(`https://user:3000/me`,
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.patch('/stats/:id', async (request: FastifyRequest, reply: FastifyReply) => {							//
		const	{ id } = request.params as { id: string };																	//
		const	parseId: number = parseInt(id, 10);																			//
																															//
		try {																												//
			const	response: AxiosResponse = await gatewayAxios.patch(`https://user:3000/stats/${parseId}`, request.body);	//	A ENLEVER
																															//
			return reply.send(response.data);																				//
		} catch (err: unknown) {																							//
			return requestErrorsHandler(gatewayFastify, reply, err);														//
		}																													//
	});	


	/* =========== STATS ROUTE =========== */

	// STATS UPDATES
																														//

	// STATS GETTER
	gatewayFastify.get('/stats/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		try {
			const	response: AxiosResponse = await gatewayAxios.get(`https://user:3000/stats/${parseId}`);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});


	/* =========== FRIENDS ROUTE =========== */

	// FRIENDS RELATION MANAGEMENT
	gatewayFastify.post('/friends/request/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId: number = parseInt(targetId, 10);

			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.post(`https://user:3000/friends/request/${parseTargetId}`, request.body,
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});


	gatewayFastify.post('/friends/:idA/:idB', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { idA, idB } = request.params as { idA: string, idB: string };
			const parseIdA = parseInt(idA, 10);
			const parseIdB = parseInt(idB, 10);

			const	response: AxiosResponse = await gatewayAxios.post(`https://user:3000/friends/${parseIdA}/${parseIdB}`, request.body);	//	AXEL: A ENLEVER

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.patch('/friends/accept/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const	{ targetId } = request.params as { targetId: string };
			const	parseTargetId: number = parseInt(targetId, 10);

			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.patch(`https://user:3000/friends/accept/${parseTargetId}`, request.body,
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/friends/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { targetId } = request.params as { targetId: string };
			const parseTargetId = parseInt(targetId, 10);

			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.delete(`https://user:3000/friends/${parseTargetId}`,
				{ headers: { 'user-id': userId } }
			);
			
			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	// RELATION GETTERS
	gatewayFastify.get('/friends/me', async (request: FastifyRequest, reply: FastifyReply) => {		
		try {
			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.get(`https://user:3000/friends/me`,
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/friends/:id', async (request: FastifyRequest, reply: FastifyReply) => {		
		try {
			const	{ id } = request.params as { id: string };
			const	parseId: number = parseInt(id, 10);

			const	response: AxiosResponse = await gatewayAxios.get(`https://user:3000/friends/${parseId}`);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.get('/friends/:idA/:idB', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { idA, idB } = request.params as { idA: string, idB: string };
			const parseIdA = parseInt(idA, 10);
			const parseIdB = parseInt(idB, 10);

			const	response: AxiosResponse = await gatewayAxios.get(`https://user:3000/friends/${parseIdA}/${parseIdB}`);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	// BLOCK ROUTES
	gatewayFastify.post('/friends/block/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { targetId } = request.params as { targetId: string };
			const parseTargetId = parseInt(targetId, 10);

			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.post(`https://user:3000/friends/block/${parseTargetId}`, request.body,
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.delete('/friends/unblock/:targetId', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { targetId } = request.params as { targetId: string };
			const parseTargetId = parseInt(targetId, 10);

			const	userId: AxiosHeaderValue = await getValidUserId(request);

			const	response: AxiosResponse = await gatewayAxios.delete(`https://user:3000/friends/unblock/${parseTargetId}`,
				{ headers: { 'user-id': userId } }
			);

			return reply.send(response.data);
		} catch (err: unknown) {
			return requestErrorsHandler(gatewayFastify, reply, err);
		}
	});

	gatewayFastify.patch('/user-stats/:id', async (request: FastifyRequest, reply: FastifyReply) => {								//
		const	{ id } = request.params as { id: string };																			//
		const	parseId: number = parseInt(id, 10);																					//
																																	//
		try {																														//
			const	response: AxiosResponse = await gatewayAxios.patch(`https://user:3000/user-stats/${parseId}`, request.body);	// A ENLEVER
																																	//
			return reply.send(response.data);																						//
		} catch (err: unknown) {																									//
			return requestErrorsHandler(gatewayFastify, reply, err);																//
		}																															//
	});																																//
}
