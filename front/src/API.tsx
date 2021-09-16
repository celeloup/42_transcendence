import axios from 'axios';

const API_BASE_URL:string = "http://localhost:8080/api";

export async function oauth(code:string) {
	await axios.get(`${API_BASE_URL}/authentication/oauth${code}`, { withCredentials: true })
		.then(response => { console.log("RESPONSE GOOD : ", response) })
		.catch(error => { console.log("Error catch :", error.response) })
}

export function isAuth() : boolean {
	let ret:boolean = false;
	axios.get(`${API_BASE_URL}/authentication`, { withCredentials: true })
		.then(response => { console.log("YES IS AUTH", response.data); ret = true; })
		.catch(error => { console.log(error.response); ret = false; })
	return (true);
}

export function logout() : void {
	axios.post(`${API_BASE_URL}/authentication/log-out`, { withCredentials: true })
		.then(response => { console.log("YES LOGOUT", response.data) })
		.catch(error => { console.log(error.response) })
}

export function authRefresh() : void {
	axios.get(`${API_BASE_URL}/authentication/refresh`, { withCredentials: true })
	.then(response => { console.log(response.data) })
	.catch(error => { console.log(error.response) })
}