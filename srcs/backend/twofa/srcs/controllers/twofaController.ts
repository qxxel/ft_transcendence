/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofaController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:16 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/21 01:04:05 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import axios			from 'axios'
import argon2			from 'argon2'
import speakeasy		from 'speakeasy'
import formData			from "form-data";
import Mailgun			from 'mailgun.js'
import { twofaAxios, twofaServ, mailgunApiKey }	from "../twofa.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'

const mailgun: Mailgun = new Mailgun(formData);

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
		step: 3000,
		}
	);
}

function verifyOtp(secret: string, otp: string) {
	return speakeasy.totp.verify(
		{
		secret,
		token: otp,
		encoding: 'base32',
		digits: 4,
		step: 3000,
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

function MailCodeMessage(user: string, otp: string, email: string) {
	return {
		from: "ft_transcendence <postmaster@sandbox67d0d7ae1bf74bc88c36bd3c0118fce1.mailgun.org>",
		to: [`${user} <${email}>`],
		subject: "Verification code",
		template: "ft_transcendence",
		"h:X-Mailgun-Variables": JSON.stringify({
			otpCode: `${otp}`,
		}),
	}
}

async function sendMailMessage(mail: any) {
	try {
		console.log("api:[", mailgunApiKey,"]")
		const mg = mailgun.client({
			username: "api",
			key: mailgunApiKey || ""
		});
		const data = await mg.messages.create("sandbox67d0d7ae1bf74bc88c36bd3c0118fce1.mailgun.org", mail);

		console.log(data);
	} catch (error) {
		console.log(error);
		throw error
	}
}

async function	generateMailCode(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	payload: AxiosResponse = await twofaAxios.get("https://jwt:3000/validate", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		const	otpSecretKey: string = generateOtpSecretKey();
		const	otp: string = generateOtp(otpSecretKey);

		await twofaServ.deleteOtpByIdClient(payload.data.id);
		await twofaServ.addOtp(payload.data.id, otpSecretKey, otp);
		
		console.log("otp :", otp);
		const	dataMail = MailCodeMessage(payload.data.user, otp, payload.data.email)
		console.log("mail :", dataMail);
		await sendMailMessage(dataMail)

		return reply.status(200).send(otp);
	} catch (err: unknown) {
		const	msgError: string = errorsHandler(err);

		console.error(msgError);

		return reply.code(400).send({ error: msgError });
	}
}

async function	validateCodeOtp(request: FastifyRequest<{ Body: { otp: string } }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		console.log("0", request.body);
		if (!request.body)
			throw new Error("The request is empty");

		console.log("1");
		const	payload: AxiosResponse = await twofaAxios.get("https://jwt:3000/validate", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		
		console.log("2", payload.data.id);
		const	otpSecretKey = await twofaServ.getOtpSecretKeyByIdClient(payload.data.id);
		console.log("2.5",otpSecretKey);
		
		const	otp = await twofaServ.getOtpByIdClient(payload.data.id);
		console.log("3", otpSecretKey);
		
		const	isOtpValid = verifyOtp(otpSecretKey, request.body.otp);
		console.log("4", isOtpValid, "\n", otpSecretKey, "\n", request.body.otp, "=", otp);
		
		if (!isOtpValid)
			throw new Error("Bad code");
		console.log("5");
		
		await twofaServ.deleteOtpByIdClient(payload.data.id);
		console.log("6");
		
		return reply.status(200).send(payload.data.id);
	} catch (err: unknown) {
		const	msgError: string = errorsHandler(err);

		console.error(msgError);

		return reply.code(400).send({ error: msgError });
	}
}

export async function	twofaController(authFastify: FastifyInstance): Promise<void> {
	authFastify.get('/otp', generateMailCode);
	authFastify.post<{ Body: { otp: string } }>('/validate', validateCodeOtp);
}
