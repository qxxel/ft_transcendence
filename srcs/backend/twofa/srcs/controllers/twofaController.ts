/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofaController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:16 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/26 10:13:20 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORTS ====================== */

import axios			from 'axios'
import speakeasy		from 'speakeasy'
import nodemailer		from 'nodemailer'
import { twofaAxios, twofaServ, emailName, emailPass }	from "../twofa.js"

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
		from: `ft_transcendence <${emailName}>`,
		to: `${user} <${email}>`,
		subject: "Verification code",
		text: `Your ft_transcendence verification code is: ${otp}`,
		html: `<p>Hello ${user},</p>
			   <p>Your ft_transcendence verification code is:</p>
			   <h2>${otp}</h2>
			   <p>This code expires in 5 minutes.</p>
			   <p>Thanks, Transcendence Team.</p>`
	};
}

async function sendMailMessage(mail: any) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: emailName,
			pass: emailPass
		}
	});

	try {
		await transporter.sendMail(mail);
		console.log("Email envoyé !");
	} catch (error) {
		console.error("Erreur:", error);
		throw error;
	}
}

async function	generateMailCode(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	payload: AxiosResponse = await twofaAxios.get("https://jwt:3000/twofa/validate", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		const	otpSecretKey: string = generateOtpSecretKey();
		const	otp: string = generateOtp(otpSecretKey);

		await twofaServ.deleteOtpByIdClient(payload.data.id);
		await twofaServ.addOtp(payload.data.id, otpSecretKey, otp);

		const	dataMail = MailCodeMessage(payload.data.username, otp, payload.data.email)
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
		if (!request.body)
			throw new Error("The request is empty");

		const	payload: AxiosResponse = await twofaAxios.get("https://jwt:3000/twofa/validate", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });

		const	otpSecretKey = await twofaServ.getOtpSecretKeyByIdClient(payload.data.id);

		const	otp = await twofaServ.getOtpByIdClient(payload.data.id);

		const	isOtpValid = verifyOtp(otpSecretKey, request.body.otp);
		
		if (!isOtpValid)
			throw new Error("Bad code");

		await twofaServ.deleteOtpByIdClient(payload.data.id);

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
