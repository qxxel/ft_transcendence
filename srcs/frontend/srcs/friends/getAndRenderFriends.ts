/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getAndRenderFriends.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kiparis <kiparis@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/27 16:02:22 by agerbaud          #+#    #+#             */
/*   Updated: 2025/12/14 04:09:31 by kiparis          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// FUNCTION THAT MAKE A GET REQUEST TO THE BACK WHEN WE ACCESS `/friends` TO DISPLAY THEM


/* ====================== IMPORTS ====================== */

import { attachDelegationListeners }		from "./friendsEvents.js"
import { AppState, appStore, UserState }	from "../objects/store.js"
import { sendRequest }						from "../utils/sendRequest.js"
import { onClickHistory }					from "../eventsHandlers/clickHandler.js"


/* ====================== INTERFACE ====================== */

interface	UserObject {
	id: number;
	username: string;
	avatar: string | null;
	email: string;
	status: string;
	receiver_id: string;
}


/* ====================== FUNCTIONS ====================== */

export async function	getAndRenderFriends(): Promise<void> {
	const	response: Response = await sendRequest('/api/user/friends/me', "get", null);
	if (!response.ok)
	{
		const	errorData: Object = await response.json();
		console.error(errorData);

		displayErrors();
		
		return ;
	}

	const	friendsData: UserObject[] = await response.json();

	renderFriends(friendsData);
}

function	renderFriends(friendsData: UserObject[]): void {
	const	requestsListDiv: HTMLDivElement = document.getElementById("requests-list") as HTMLDivElement;
	if (!requestsListDiv) return;
	requestsListDiv.innerHTML = "<h2>PENDING REQUEST</h2>";

	const	friendsListDiv: HTMLDivElement = document.getElementById("friends-list") as HTMLDivElement;
	if (!friendsListDiv) return;
	friendsListDiv.innerHTML = "<h1>FRIENDS LIST</h1>";

	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;

	if (friendsData.filter((value: UserObject) => { return user.id === parseInt(value.receiver_id, 10) && value.status === "PENDING"; }).length === 0)
		displayNoRequest(requestsListDiv);

	if (friendsData.filter((value: UserObject) => { return value.status === "ACCEPTED"; }).length === 0)
		displayNoFriends(friendsListDiv);

	friendsData.forEach((value: UserObject) => {
		createFriendElement(requestsListDiv, friendsListDiv, value);
	});


	attachDelegationListeners(requestsListDiv, friendsListDiv);
}

function	createFriendElement(requestsListDiv: HTMLDivElement, friendsListDiv: HTMLDivElement, friend: UserObject): void {
	const	state: AppState = appStore.getState();
	const	user: UserState = state.user;

	if (user.id === parseInt(friend.receiver_id, 10) && friend.status === "PENDING")
	{
		addRequestInList(requestsListDiv, friend);
		return ;
	}

	if (friend.status === "ACCEPTED")
	{
		addFriendInList(friendsListDiv, friend);
		return ;
	}
}

function	addRequestInList(requestsListDiv: HTMLDivElement, friend: UserObject): void {
	const	newDiv: HTMLDivElement = document.createElement("div");
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
	acceptButton.dataset.targetId = friend.id.toString();
	acceptButton.dataset.targetUsername = friend.username;

	const	ignoreButton: HTMLSpanElement = document.createElement("button");
	ignoreButton.classList.add("neon-button");
	ignoreButton.classList.add("ignore-button");
	ignoreButton.textContent = "IGNORE";
	ignoreButton.dataset.targetId = friend.id.toString();
	ignoreButton.dataset.targetUsername = friend.username;


	newActionDiv.appendChild(acceptButton);
	newActionDiv.appendChild(ignoreButton);

	newDiv.appendChild(usernameSpan);
	newDiv.appendChild(newActionDiv);

	requestsListDiv.appendChild(newDiv);
}

function	addFriendInList(friendsListDiv: HTMLDivElement, friend: UserObject): void {
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

	const	historyButton: HTMLButtonElement = document.createElement("button");
	historyButton.classList.add("neon-button");
	historyButton.classList.add("history-button");
	historyButton.dataset.targetId = friend.id.toString();
	historyButton.dataset.targetUsername = friend.username;
	historyButton.onclick = () => onClickHistory(friend.id, friend.username);
	historyButton.textContent = "History";

	const	removeButton: HTMLButtonElement = document.createElement("button");
	removeButton.classList.add("remove-button");
	removeButton.dataset.targetId = friend.id.toString();
	removeButton.dataset.targetUsername = friend.username;
	removeButton.textContent = "✕";


	newActionDiv.appendChild(historyButton);
	newActionDiv.appendChild(removeButton);

	newDiv.appendChild(statusSpan);
	newDiv.appendChild(usernameSpan);
	newDiv.appendChild(newActionDiv);

	friendsListDiv.appendChild(newDiv);
}

function	displayNoRequest(requestsListDiv: HTMLDivElement): void {
	const	emptyMessageParagraph: HTMLParagraphElement = document.createElement("p");
	emptyMessageParagraph.classList.add("empty-message");
	emptyMessageParagraph.classList.add("requests-empty");
	emptyMessageParagraph.textContent = "No request pending. 😴";


	requestsListDiv.appendChild(emptyMessageParagraph);
}

function	displayNoFriends(friendsListDiv: HTMLDivElement): void {
	const	emptyMessageParagraph: HTMLParagraphElement = document.createElement("p");
	emptyMessageParagraph.classList.add("empty-message");
	emptyMessageParagraph.classList.add("friends-empty");
	emptyMessageParagraph.textContent = "You have no friend yet. 😭";


	friendsListDiv.appendChild(emptyMessageParagraph);
}

function	displayErrors(): void {
	const	requestsListDiv: HTMLDivElement = document.getElementById("requests-list") as HTMLDivElement;
	if (!requestsListDiv) return;
	requestsListDiv.innerHTML = "<h2>PENDING REQUEST</h2>";	

	const	friendsListDiv: HTMLDivElement = document.getElementById("friends-list") as HTMLDivElement;
	if (!friendsListDiv) return;
	friendsListDiv.innerHTML = "<h1>FRIENDS LIST</h1>";

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
