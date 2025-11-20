/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   2faController.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:16 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/20 02:42:13 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import axios			from 'axios'
import speakeasy		from 'speakeasy'
import formData			from "form-data";
import Mailgun			from 'mailgun.js'
import { twofaAxios, mailgunApiKey }	from "../2fa.js"

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

function MailCodeMessage(user: string, otp: string, email: string) {
	return {
		from: "ft_transcendence <postmaster@sandbox67d0d7ae1bf74bc88c36bd3c0118fce1.mailgun.org>",
		to: [`${user} <${email}>`],
		subject: "Verification code",
		template: "ft_transcendence",
		"h:X-Mailgun-Variables": JSON.stringify({
			optCode: `${otp}`,
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

async function	getOpt(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const otpSecretKey: string = generateOtpSecretKey();
		const otp: string = generateOtp(otpSecretKey);
		// const isOtpValid = verifyOtp(otpSecretKey, otp);
		
		console.log("otp :", otp);
		const dataMail = MailCodeMessage("mreynaud", otp, "mathisreynaud07@gmail.com")
		console.log("mail :", dataMail);
		await sendMailMessage(dataMail)

		return reply.status(200).send(otp);
	} catch (err: unknown) {
		const	msgError: string = errorsHandler(err);

		console.error(msgError);

		return reply.code(400).send({ error: msgError });
	}
}

export async function	twofaController(authFastify: FastifyInstance): Promise<void> {
	authFastify.get('/opt', getOpt);
}
