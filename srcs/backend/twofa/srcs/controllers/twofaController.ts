/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twofaController.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/19 22:35:16 by mreynaud          #+#    #+#             */
/*   Updated: 2025/12/19 06:31:45 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// HANDLE ALL 2FA-RELATED REQUESTS: GENERATE, VALIDATE, AND DELETE OTP CODES


/* ====================== IMPORTS ====================== */

import speakeasy							from 'speakeasy'
import nodemailer							from 'nodemailer'
import { emailPass, twofaFastify }			from "../twofa.js"
import { twofaAxios, twofaServ, emailName }	from "../twofa.js"
import * as twofaError						from "../utils/throwErrors.js"
import { errorsHandler }					from "../utils/errorsHandler.js"

import type { AxiosResponse }									from 'axios'
import type { FastifyInstance, FastifyRequest, FastifyReply }	from 'fastify'

/* ====================== INTERFACES ====================== */

/* ====================== FUNCTIONS ====================== */

function generateOtpSecretKey(): string {
	const	secretKey = speakeasy.generateSecret();
	return secretKey.base32;
}

function generateOtp(secretKey: string): string {
	return speakeasy.totp({
		secret: secretKey,
		encoding: 'base32',
		digits: 4,
		step: 3000,
	});
}

function verifyOtp(secret: string, otp: string): boolean {
	return speakeasy.totp.verify( {
		secret,
		token: otp,
		encoding: 'base32',
		digits: 4,
		step: 3000,
	});
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function MailCodeMessage(user: string, otp: string, email: string) {
	const safeEmail = escapeHtml(email.replace(/[\x00-\x1F\x7F]/g, ""));
	const safeUser = escapeHtml(user.replace(/[\x00-\x1F\x7F]/g, ""));
	const safeOtp = escapeHtml(otp);

	return {
		from: `ft_transcendence <${emailName}>`,
		to: `${safeUser} <${safeEmail}>`,
		subject: "Verification code",
		text: `Your ft_transcendence verification code is: ${safeOtp}`,
		html: `<p>Hello ${safeUser},</p>
				<p>Your ft_transcendence verification code is:</p>
				<h2>${safeOtp}</h2>
				<p>This code expires in 5 minutes.</p>
				<p>Thanks, Transcendence Team.</p>`
	};
}

async function sendMailMessage(mail: any): Promise<void> {
	const	transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: emailName,
			pass: emailPass
		},
		connectionTimeout: 2000,
		greetingTimeout: 2000,
		socketTimeout: 4000,
	});
	await transporter.sendMail(mail);
}

async function	generateMailCode(request: FastifyRequest<{ Body: { email?: string } }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		let	payload: AxiosResponse;
		try {
			payload = await twofaAxios.get("http://jwt:3000/payload/twofa", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		} catch (error: unknown) {
			payload = await twofaAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
		}
		const	otpSecretKey: string = generateOtpSecretKey();
		const	otp: string = generateOtp(otpSecretKey);

		if (!payload || !payload.data || !payload.data.id)
			throw new twofaError.MissingIdError("Id of the user is missing!");
			
		await twofaServ.deleteOtpByIdClient(payload.data.id);
		await twofaServ.addOtp(payload.data.id, otpSecretKey);

		const	dataMail = MailCodeMessage(payload.data.username, otp, request.body.email || payload.data.email);
		await sendMailMessage(dataMail);

		return reply.status(201).send();
	} catch (error: unknown) {
		return await errorsHandler(twofaFastify, reply, error);
	}
}

async function	validateCodeOtp(request: FastifyRequest<{ Body: { otp: string } }>, reply: FastifyReply): Promise<FastifyReply> {
	try {
		if (!request.body)
			throw new twofaError.RequestEmptyError("The request is empty");

		let	payload: AxiosResponse;
		let	isJwtTwofa: boolean;
		try {
			payload = await twofaAxios.get("http://jwt:3000/payload/twofa", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
			isJwtTwofa = true;
		} catch (error: unknown) {
			payload = await twofaAxios.get("http://jwt:3000/payload/access", { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
			isJwtTwofa = false;
		}
		
		if (!payload || !payload.data || !payload.data.id)
			throw new twofaError.MissingIdError("Id of the user is missing!");

		const	otpSecretKey: string | null = await twofaServ.getOtpSecretKeyByIdClient(payload.data.id);
		
		if (!otpSecretKey)
			throw new twofaError.WrongCodeError("Wrong code!");

		const	isOtpValid: boolean = verifyOtp(otpSecretKey, request.body.otp);
		
		if (!isOtpValid)
			throw new twofaError.WrongCodeError("Wrong code!");
		
		if (isJwtTwofa) {
			const	jwtRes: AxiosResponse = await twofaAxios.post("http://jwt:3000/twofa/validate", {}, { withCredentials: true, headers: { Cookie: request.headers.cookie || "" } });
			
			if (jwtRes.headers['set-cookie'])
				reply.header('Set-Cookie', jwtRes.headers['set-cookie']);
		}
		
		await twofaServ.deleteOtpByIdClient(payload.data.id);
		
		return reply.status(200).send(payload.data.id);
	} catch (error: unknown) {
		return await errorsHandler(twofaFastify, reply, error);
	}
}

async function	deleteCodeOtp(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const	{ id } = request.params as { id: string };
		const	parseId: number = parseInt(id, 10);

		await twofaServ.deleteOtpByIdClient(parseId);
		
		return reply.status(204).send();
	} catch (error: unknown) {
		return await errorsHandler(twofaFastify, reply, error);
	}
}

export function	twofaController(authFastify: FastifyInstance): void {
	authFastify.post<{ Body: { email?: string } }>('/otp', generateMailCode);
	authFastify.post<{ Body: { otp: string } }>('/validate', validateCodeOtp);
	authFastify.delete('/:id', deleteCodeOtp);
}
