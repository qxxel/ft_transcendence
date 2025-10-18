export interface User {
	name: string;
	email: string;
	phoneNumber: string;
}

export class UserService {
	private	users: User[];

	constructor() {
		var	itemUsers: string | null = localStorage.getItem('users')
		if (itemUsers === null) {
			this.users = [];
			return ;
		}

		this.users = JSON.parse(itemUsers);
	}

	getUsers(): User[] {
		return this.users;
	}

	addUser(user: User) {
		this.users.push(user);
		this.saveUsers();
	}

	updateUser(index: number, user: User) {
		this.users[index] = user;
		this.saveUsers();
	}

	deleteUser(index: number) {
		this.users.splice(index, 1);
		this.saveUsers();
	}

	saveUsers() {
		localStorage.setItem('users', JSON.stringify(this.users));
	}
}
