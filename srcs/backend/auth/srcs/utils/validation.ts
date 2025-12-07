/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validation.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mreynaud <mreynaud@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:58:16 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/07 15:53:54 by mreynaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ADD UTILS FOR USER DTOs, ESPECIALLY FOR VALIDATION OF NAME AND PASSWORD

/* ====================== interface	====================== */

export interface	validationResult {
	result: boolean,
	error: string;
};

interface	rule {
	test: (value: string) => boolean;
	message: string;
};


/* ====================== FUNCTIONS ====================== */

export function	isValidPassword(name: string): validationResult {
	const rules: rule[] = [
		{ test: v => typeof v === "string", message: "Password must be a valid string" },
		{ test: v => v.length >= 8, message: "Password must be at least 8 characters long" },
		{ test: v => v.length <= 64, message: "Password must not exceed 64 characters" },
		{ test: v => /[a-z]/.test(v), message: "Password must contain at least one lowercase letter" },
		{ test: v => /[A-Z]/.test(v), message: "Password must contain at least one uppercase letter" },
		{ test: v => /[0-9]/.test(v), message: "Password must contain at least one number" },
		{ test: v => /[!@#$%^&*(),.?:{}|<>_\-+=~`[\]\\/]/.test(v), message: "Password must contain at least one special character" }
	];

	return validate(name, rules);
}

function	validate(value: string, rules: rule[]): validationResult {
	const	errors = rules
		.filter(rule => !rule.test(value))
		.map(rule => rule.message)
		.join("; ");

	return { result: errors.length === 0, error: errors };
}
