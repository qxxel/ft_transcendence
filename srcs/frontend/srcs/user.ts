export class User {
	private	signedIn: boolean;
	private	username: string;

	constructor() {
		this.signedIn = false;
		this.username = "";
	}

	isSignedIn(): boolean {
		return this.signedIn;
	}

	getUsername(): string {
		return this.username;
	}

	setSigned(bool: boolean) {
		this.signedIn = bool;
	}

	setUsername(username: string) {
		this.username = username;
	}
}
