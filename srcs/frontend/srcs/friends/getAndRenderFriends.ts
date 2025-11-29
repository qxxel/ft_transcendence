/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getAndRenderFriends.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:02:22 by agerbaud          #+#    #+#             */
/*   Updated: 2025/11/27 23:01:33 by agerbaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT MAKE A GET REQUEST TO THE BACK WHEN WE ACCESS `/friends` TO DISPLAY THEM


/* ====================== IMPORT ====================== */

import type { User } from "../user/user.js";
import { sendRequest }	from "../utils/sendRequest.js"



interface	UserObject {
	id: number,
	username: string,
	avatar: string | null,
	email: string,
	status: string
}


/* ====================== FUNCTIONS ====================== */

export async function	getAndRenderFriends(): Promise<void> {
	const	response: Response = await sendRequest('/api/user/friends/me', "get", null);
	if (!response.ok)
	{
		const errorData: Object = await response.json();
		console.error(errorData);

		displayErrors();

		return ;
	}

	const	friendsData: UserObject[] = await response.json();

	if (friendsData.filter((value: UserObject) => { return value.status === "PENDING"; }).length === 0)
		displayNoRequest();

	if (friendsData.filter((value: UserObject) => { return value.status === "ACCEPTED"; }).length === 0)
		displayNoFriends();

	renderFriends(friendsData);
}

function	renderFriends(friendsData: UserObject[]): void {
	friendsData.forEach((value: UserObject) => {
		createFriendElement(value);
	});
}

function	createFriendElement(friend: UserObject): void {
	console.log(friend);

	if (friend.status === "PENDING")
	{
		addRequestInList(friend);
		return ;
	}

	if (friend.status === "ACCEPTED")
	{
		addFriendInList(friend);
		return ;
	}
}

function	addRequestInList(friend: UserObject): void {
	const	requestsListDiv: HTMLDivElement = document.getElementById("requests-list") as HTMLDivElement;

	const	newDiv: HTMLDivElement = document.createElement("div");
	newDiv.id = `${friend.id}`;
	newDiv.classList.add("friend-entry");
	newDiv.classList.add("pending-request");

	const	newActionDiv: HTMLDivElement = document.createElement("div");
	newActionDiv.classList.add("actions");

	const	usernameSpan: HTMLSpanElement = document.createElement("span");
	usernameSpan.classList.add("username");
	usernameSpan.textContent = friend.username;

	const	acceptButton: HTMLSpanElement = document.createElement("button");
	acceptButton.classList.add("neon-button");
	acceptButton.classList.add("accept-button");
	acceptButton.textContent = "ACCEPT";

	const	ignoreButton: HTMLSpanElement = document.createElement("button");
	ignoreButton.classList.add("neon-button");
	ignoreButton.classList.add("ignore-button");
	ignoreButton.textContent = "IGNORE";


	newActionDiv.appendChild(acceptButton);
	newActionDiv.appendChild(ignoreButton);

	newDiv.appendChild(usernameSpan);
	newDiv.appendChild(newActionDiv);

	requestsListDiv.appendChild(newDiv);
}

function	addFriendInList(friend: UserObject): void {
	const	friendsListDiv: HTMLDivElement = document.getElementById("friends-list") as HTMLDivElement;

	const	newDiv: HTMLDivElement = document.createElement("div");
	newDiv.id = `${friend.id}`;
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

	const	challengeButton: HTMLSpanElement = document.createElement("button");
	challengeButton.classList.add("neon-button");
	challengeButton.classList.add("challenge-button");
	challengeButton.textContent = "FIGHT ⚔️";

	const	removeButton: HTMLSpanElement = document.createElement("button");
	removeButton.classList.add("remove-button");
	removeButton.textContent = "✕";


	newActionDiv.appendChild(challengeButton);
	newActionDiv.appendChild(removeButton);

	newDiv.appendChild(statusSpan);
	newDiv.appendChild(usernameSpan);
	newDiv.appendChild(newActionDiv);

	friendsListDiv.appendChild(newDiv);
}

function	displayNoRequest(): void {
	const	requestsListDiv: HTMLDivElement = document.getElementById("requests-list") as HTMLDivElement;

	const	emptyMessageParagraph: HTMLParagraphElement = document.createElement("p");
	emptyMessageParagraph.classList.add("empty-message");
	emptyMessageParagraph.classList.add("requests-empty");
	emptyMessageParagraph.textContent = "No request pending. 😴";


	requestsListDiv.appendChild(emptyMessageParagraph);
}

function	displayNoFriends(): void {
	const	friendsListDiv: HTMLDivElement = document.getElementById("friends-list") as HTMLDivElement;

	const	emptyMessageParagraph: HTMLParagraphElement = document.createElement("p");
	emptyMessageParagraph.classList.add("empty-message");
	emptyMessageParagraph.classList.add("friends-empty");
	emptyMessageParagraph.textContent = "You have no friend yet. 😭";


	friendsListDiv.appendChild(emptyMessageParagraph);
}

function	displayErrors(): void {
	const	friendsListDiv: HTMLDivElement = document.getElementById("friends-list") as HTMLDivElement;
	const	requestsListDiv: HTMLDivElement = document.getElementById("friends-list") as HTMLDivElement;

	const	requestsErrorParagraph: HTMLParagraphElement = document.createElement("p");
	requestsErrorParagraph.classList.add("error-message");
	requestsErrorParagraph.classList.add("requests-error");
	requestsErrorParagraph.textContent = "Error while getting requests.";

	const	friendsErrorParagraph: HTMLParagraphElement = document.createElement("p");
	friendsErrorParagraph.classList.add("error-message");
	friendsErrorParagraph.classList.add("friends-error");
	friendsErrorParagraph.textContent = "Error while getting friends.";


	requestsListDiv.appendChild(requestsErrorParagraph);
	friendsListDiv.appendChild(friendsErrorParagraph);
}
