/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validation.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 14:48:59 by agerbaud          #+#    #+#             */
/*   Updated: 2025/10/29 17:12:26 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ADD UTILS FOR `userDto`, ESPECIALLY FOR VALIDATION OF NAME AND PASSWORD


/* ====================== INTERFACE / TYPE ====================== */

export interface	validationResult {
	result: boolean,
	error: string;
};

interface	rule {
	test: (value: string) => boolean;
	message: string;
};


/* ====================== FUNCTIONS ====================== */

export function isValidName(name: string): validationResult {
	const rules: rule[] = [
		{ test: v => typeof v !== "string", message: "Username must be a valid string." },
		{ test: v => v.length >= 3, message: "Username must be at least 3 characters long." },
		{ test: v => v.length <= 20, message: "Username must not exceed 20 characters." },
		{ test: v => /^[a-zA-Z0-9_-]+$/.test(v), message: "Username contains invalid characters." }
	];
	
	return validate(name, rules);
}

export function isValidPwd(pwd: string): validationResult {
	const rules: rule[] = [
		{ test: v => typeof v !== "string", message: "Password must be a valid string." },
		{ test: v => v.length >= 8, message: "Password must be at least 8 characters long." },
		{ test: v => v.length >= 64, message: "Password must not exceed 64 characters." },
		{ test: v => /[A-Z]/.test(v), message: "Password must contain at least one uppercase letter." },
		{ test: v => /[a-z]/.test(v), message: "Password must contain at least one lowercase letter." },
		{ test: v => /\d/.test(v), message: "Password must contain at least one number." },
		{ test: v => /[!@#$%^&*()_\-+=]/.test(v), message: "Password must contain at least one special character." }
	];
	
	return validate(pwd, rules);
}

function validate(value: string, rules: rule[]): validationResult {
	const errors = rules
		.filter(rule => !rule.test(value))
		.map(rule => rule.message)
		.join(", ");

	return { result: errors.length === 0, error: errors };
}
