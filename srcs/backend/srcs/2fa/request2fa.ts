/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   request2fa.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/09 19:39:53 by mreynaud          #+#    #+#             */
/*   Updated: 2025/11/09 19:50:20 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ====================== IMPORT ====================== */

import { FastifyRequest, FastifyReply } from 'fastify';
// import { userDto } from "../dtos/userDto.js";
const speakeasy = require('speakeasy');

/* ====================== FUNCTIONS ====================== */

function generateOtpSecretKey(): string {
  const secretKey = speakeasy.generateSecret();
  return secretKey.base32;
}

function generateOtp(secretKey: string): string {
  return speakeasy.totp(
    {
      secret: secretKey,
      encoding: 'base32',
      digits: 4,
      step: 30,
    }
  );
}

function verifyOtp(secret: string, otp: string): boolean {
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

export async function twofa(request: FastifyRequest, reply: FastifyReply)
{
    if (!request.body)
    {
        reply.code(400);
        return "The request is empty";
    }
    try {
        // const cookies = getCookies(request);
        // const accessToken = cookies.accessToken;
        
        // return await reply.status(201).send(user);

        
        // if (verifyOtp(user.getSecretCode(), (request.body as any).otpCode))
        // 	return await reply.status(201).send(user);
        // return await reply.status(401).send({error: "Invalid otp"});
    }
    catch (err) {
        reply.code(400);
        return err;
    }
}
