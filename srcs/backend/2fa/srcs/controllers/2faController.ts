/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   2faController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:16 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/19 23:28:34 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import axios			from 'axios'
import speakeasy		from 'speakeasy'
import mailgun			from 'mailgun.js'
import { twofaAxios }	from "../2fa.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'

/* ====================== INTERFACES ====================== */

/* ====================== FUNCTIONS ====================== */

function generateOtpSecretKey() {
	const secretKey = speakeasy.generateSecret();
	return secretKey.base32;
}

function generateOtp(secretKey: string) {
	return speakeasy.totp(
		{
		secret: secretKey,
		encoding: 'base32',
		digits: 4,
		step: 30,
		}
	);
}

function verifyOtp(secret: string, otp: string) {
	return speakeasy.totp.verify(
		{
		secret,
		token: otp,
		encoding: 'base32',
		step: 30,
		digits: 4,
		}
	);
}

function errorsHandler(err: unknown): string {
	if (axios.isAxiosError(err)) {
		if (err.response?.data?.error)
			return err.response.data.error;

		return err.message;
	}

	if (err instanceof Error)
		return err.message;

	return "Unknown error";
}

async function	getOpt(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const otpSecretKey: string = generateOtpSecretKey();
		const otp: string = generateOtp(otpSecretKey);
		// const isOtpValid = verifyOtp(otpSecretKey, otp);
		
		console.log("otp :", otp);
		return reply.status(204).send(otp);
	} catch (err: unknown) {
		const	msgError: string = errorsHandler(err);

		console.error(msgError);

		return reply.code(400).send({ error: msgError });
	}
}

export async function	twofaController(authFastify: FastifyInstance): Promise<void> {
	authFastify.get('/opt', getOpt);
}
