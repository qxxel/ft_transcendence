/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getAndRenderFriends.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:02:22 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/27 19:01:50 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT MAKE A GET REQUEST TO THE BACK WHEN WE ACCESS `/friends` TO DISPLAY THEM


/* ====================== IMPORT ====================== */

import { sendRequest }	from "../utils/sendRequest.js"



interface	UserObject {
	id: number,
	username: string,
	email: string,
	avatar: string | null
}


/* ====================== FUNCTIONS ====================== */

export async function	getAndRenderFriends(): Promise<void> {
	const	response: Response = await sendRequest('/api/user/friends/me', "get", null);
	if (!response.ok)
	{
		const errorData: Object = await response.json();

		return ;	//	AXEL: A GERER
		// JS:
		// if (!response.ok)
		// {
		// const    p = document.getElementById("msg-error");
		// if (!p)
		// {
		// console.error("No HTMLElement named \`msg-error\`.");
		// return ;
		// }
		// p.textContent = result?.error || "An unexpected error has occurred";
		// return ;
		// }
		// html:
		// <p id="msg-error" hidden></p>
	}

	const	friendsData: UserObject[] = await response.json();

	renderFriends(friendsData);
}

function	renderFriends(friendsData: UserObject[]): void {
	friendsData.forEach((value: UserObject) => {
		createFriendElement(value);
	});
}

function	createFriendElement(friend: UserObject): void {
	console.log(friend);

	const	friendsListDiv: HTMLDivElement = document.getElementById("friends-list") as HTMLDivElement;


	const	newDiv: HTMLDivElement = document.createElement("div");

	newDiv.classList.add("friend-entry");
	newDiv.classList.add("online");


	const	newActionDiv: HTMLDivElement = document.createElement("div");

	newActionDiv.classList.add("actions");


	const	statusSpan: HTMLSpanElement = document.createElement("span");

	statusSpan.classList.add("status-dot");
	statusSpan.classList.add("green-glow");


	const	usernameSpan: HTMLSpanElement = document.createElement("span");

	usernameSpan.classList.add("username");
	usernameSpan.textContent = friend.username;


	const	statusTextSpan: HTMLSpanElement = document.createElement("span");

	statusTextSpan.classList.add("status-text");
	statusTextSpan.textContent = "(Online)";

	
	const	challengeButton: HTMLSpanElement = document.createElement("span");

	challengeButton.classList.add("neon-button");
	challengeButton.classList.add("challenge-button");
	challengeButton.textContent = "FIGHT ⚔️";


	const	removeButton: HTMLSpanElement = document.createElement("span");

	removeButton.classList.add("remove-button");
	removeButton.textContent = "x";

	newActionDiv.appendChild(challengeButton);
	newActionDiv.appendChild(removeButton);

	newDiv.appendChild(statusSpan);
	newDiv.appendChild(usernameSpan);
	newDiv.appendChild(statusTextSpan);
	newDiv.appendChild(newActionDiv);

	friendsListDiv.appendChild(newDiv);
}
