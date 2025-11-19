/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validation.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/14 18:58:16 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/19 15:49:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ADD UTILS FOR USER DTOs, ESPECIALLY FOR VALIDATION OF NAME AND PASSWORD

/* ====================== IMPORT ====================== */

import type { Database }	from "sqlite3"

/* ====================== INTERFACE ====================== */

export interface	validationResult {
	result: boolean,
	error: string;
};

interface	rule {
	test: (value: string) => boolean;
	message: string;
};


/* ====================== FUNCTIONS ====================== */

export function	isValidName(name: string): validationResult {
	const	rules: rule[] = [
		{ test: v => typeof v === "string", message: "Username must be a valid string" },
		{ test: v => v.length >= 3, message: "Username must be at least 3 characters long" },
		{ test: v => v.length <= 20, message: "Username must not exceed 20 characters" },
		{ test: v => /^[a-zA-Z0-9_-]+$/.test(v), message: "Username contains invalid characters" }
	];

	return validate(name, rules);
}

export function	isValidEmail(email: string): validationResult {
	const	rules: rule[] = [
		{ test: v => typeof v === "string", message: "Email must be a valid string" },
		{ test: v => v.length >= 6, message: "Username must be at least 6 characters long" },
		{ test: v => v.length <= 320, message: "Email must not exceed 320 characters" },
		{ test: v => /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(v), message: "Email must be valid" }
	];

	return validate(email, rules);
}

function	validate(value: string, rules: rule[]): validationResult {
	const	errors = rules
		.filter(rule => !rule.test(value))
		.map(rule => rule.message)
		.join("; ");

	return { result: errors.length === 0, error: errors };
}


export async function	isTaken(db: Database, query: string, elements: Array<string>): Promise<boolean> {
	return new Promise((resolve, reject) => {
		db.get(query, elements, (err, row) => {
			if (err)
				return reject(err);

			resolve(!!row);
		});
	});
}
