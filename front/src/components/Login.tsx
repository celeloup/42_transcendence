import axios from 'axios';
import { AuthContext, ContextType }  from '../contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

function Login(){
	const [ redir, setRedir ] = useState<boolean>(false);
	const { login } = useContext(AuthContext) as ContextType;
	const [ ghostLogin, setGhostLogin ] = useState<boolean>(false);
	
	useEffect(() => {
		if (ghostLogin)
		{
			axios.post(`/authentication/register`, { "id42": 30, "email": "tes8@test.com", "name": "ghosty"})
			.then (response => {
				console.log(response);
				login(response.data);
				setRedir(true);
			})
			.catch(error => {
				console.log("Error catch :", error.response);
			})
		}
	}, [ghostLogin]);

	
	const ghost_register = () => {
		setGhostLogin(true);
		// try {
		// 	const res = await axios.post(`/authentication/register`, { "id42": 5, "email": "test2@test.com", "name": "ghost3"});
			
		// } catch (err) {
		// 	console.log(err);
		// }
	};
	
	if (!redir)
	{
		return (
			<div className="Login">
				<p>Pong Wars is an amazing game where you can challenge your friends to a match of Pong in Space ! <br></br>Login to play</p>
				<div id="42LoginButton"><a href="https://api.intra.42.fr/oauth/authorize?client_id=19e5ab89328bbc134e124cc4611ecc7c3fd0d88176bd38eda6e7ee23d649df3b&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth&response_type=code">Login 42</a></div>
			
				<button onClick={ ghost_register }>GHOST REGISTER (TEST)</button>
			</div>
		);
	}
	else {
		return <Redirect to={{ pathname: '/' }} />;
	}
}

export default Login;
