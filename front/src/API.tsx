import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080/api";

export function oauth(code:string) {
	  axios.get(`/authentication/oauth${code}`)
		.then(response => { console.log("RESPONSE GOOD : ", response) })
		.catch(error => { console.log("Error catch :", error.response) })
}

// export async function isAuth(login:() => void, logout:() => void) {
// 	return axios.get(`/authentication`)
// 		.then(response => { 
// 			console.log("YES IS AUTH", response.data);
// 			login();
// 			// return response; 
// 		})
// 		.catch(error => {
// 			console.log(error.response);
// 			logout();
// 		})
// }

export async function logout() {
	await axios.post(`/authentication/log-out`)
		.then(response => { console.log("user logged out"); })
		.catch(error => { console.log(error.response) })
}

export function authRefresh() : void {
	axios.get(`/authentication/refresh`)
	.then(response => { console.log(response.data) })
	.catch(error => { console.log(error.response) })
}