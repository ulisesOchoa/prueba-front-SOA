export default function authHeader() {
	const userStr = localStorage.getItem("user");
	let user = null;
	if (userStr) user = JSON.parse(userStr);

	if (user && user.token) {
		return { Authorization: "Bearer " + user.token }; 
		// return { 'x-access-token': user.accessToken };       // para Node.js Express back-end
	} else {
		return { Authorization: "" };
		// return { 'x-access-token': null }; // para Node Express back-end
	}
}
