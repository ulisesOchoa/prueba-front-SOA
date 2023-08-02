import axios from "axios";

const API_URL = process.env.REACT_APP_AUTH_DOMAIN;

class AuthService {
	async login(email: string, password: string) {
		return axios
			.post(API_URL + "login", {
				email,
				password,
			})
			.then((response) => {
				if (response.status === 200) {					
					const userData = {
						...response.data.model.user,
						token: response.data.model.token,
						roles: response.data.model.user.roles,
					};
					localStorage.setItem("user", JSON.stringify(userData));
				}

				return response.data;
			});
	}

	logout() {
		localStorage.removeItem("user");
	}

	register(name: string, email: string, password: string, password_confirmation: string) {
		return axios.post(API_URL + "register", {
			name,
			email,
			password,
			password_confirmation
		});
	}

	getCurrentUser() {
		const userStr = localStorage.getItem("user");
		if (userStr) return JSON.parse(userStr);

		return null;
	}
}

export default new AuthService();
