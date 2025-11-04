export class User {
	private	signedIn: boolean;
	private	id?: number;
	private	username?: string;

	constructor() {
		this.signedIn = false;
	}

	logout(): void {
		this.id = undefined;
		this.username = undefined;
		this.signedIn = false;
	}

	isSignedIn(): boolean {
		return this.signedIn;
	}

	getUsername(): string | undefined {
		if (this.username)
			return this.username;
	}

	setSigned(bool: boolean) {
		this.signedIn = bool;
	}

	setUsername(username: string) {
		this.username = username;
	}

	setId(id: number) {
		this.id = id;
	}
}
