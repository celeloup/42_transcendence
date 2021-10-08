import axios from 'axios';
import { AuthContext, ContextType }  from '../contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/Login.scss';
import Logo from './ui_components/Logo';

function Login(){
	const [ redir, setRedir ] = useState<boolean>(false);
	const { login } = useContext(AuthContext) as ContextType;

	const [ ghostLogin, setGhostLogin ] = useState<boolean>(false);
	const ghost_register = () => {
		setGhostLogin(true);
	};

	useEffect(() => {
		if (ghostLogin)
		{
			axios.post(`/authentication/register`, { "id42": 31, "email": "test@test.com", "name": "ghosty"})
			.then (response => {
				console.log(response);
				login(response.data);
				setRedir(true);
				setGhostLogin(false);
			})
			.catch(error => {
				console.log("Error catch :", error.response);
				setGhostLogin(false);
			})
		}
	}, [ghostLogin]); // eslint-disable-line

	if (!redir)
	{
		return (
			<div className="login" >
				<Logo/>
				<p>Pong Wars is an amazing game where you can challenge your friends to a match of Pong in Space ! <br></br>Login to play</p>
				<div id="42LoginButton">
					<a id="login_button" href="https://api.intra.42.fr/oauth/authorize?client_id=19e5ab89328bbc134e124cc4611ecc7c3fd0d88176bd38eda6e7ee23d649df3b&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth&response_type=code">
						Login 42
					</a>
				</div>
				<button onClick={ ghost_register }>GHOST REGISTER (TEST)</button>
			</div>
		);
	}
	else {
		return <Redirect to={{ pathname: '/' }} />;
	}
}

export default Login;
