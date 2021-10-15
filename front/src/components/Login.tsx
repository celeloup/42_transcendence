import axios from 'axios';
import { AuthContext, ContextType }  from '../contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/Login.scss';
import Logo from './ui_components/Logo';
import Logo42 from './ui_components/42Logo';

function Login() {
	const [ redir, setRedir ] = useState<boolean>(false);
	const { login } = useContext(AuthContext) as ContextType;

	const [ ghostLogin, setGhostLogin ] = useState<number>(0);
	const ghost_register = (id42:number) => {
		setGhostLogin(id42);
	};

	useEffect(() => {
		if (ghostLogin !== 0)
		{
			axios.post(`/authentication/register`, { "id42": 30, "email": "ghosty@mail.com", "name":"ghosty" })
			.then (response => {
				// console.log(response);
				login(response.data);
				setRedir(true);
				setGhostLogin(0);
			})
			.catch(error => {
				console.log("Error catch :", error);
				// if (!error.data)
				// 	alert("Looks like the back is down !!\n\nERR_EMPTY_RESPONSE");
				// if (error.data.statusCode === 404)
				// {
				// 	console.log(error);
					// axios.post(`/authentication/register`, { "id42": 1, email:"ghosty@mail.com", name: "ghosty"})
					// .then (response => {
					// 	console.log(response);
					// 	login(response.data);
					// 	setRedir(true);
					// 	// setGhostLogin(0);
					// })
					// .catch(error => {
					// 	console.log("Error catch :", error);
					// 	// setGhostLogin(0);
					// })
				// }
				setGhostLogin(0);
			})
		}
	}, [ghostLogin]); // eslint-disable-line

	if (!redir)
	{
		return (
			<div className="login" >
				<Logo/>
				<a id="login_button" href={ process.env.REACT_APP_OAUTH }>
					<Logo42 /> LOGIN
				</a>
				<div id="ghosts">
					<div className="ghost_button" onClick={ () => { ghost_register(1); } }><i className="fas fa-ghost"></i>GHOSTY</div>
					{/* <div className="ghost_button" onClick={ () => { ghost_register(2); } }><i className="fas fa-ghost"></i>ADMINISTRAGHOST</div>
					<div className="ghost_button" onClick={ () => { ghost_register(3); } }><i className="fas fa-ghost"></i>MODOGHOST</div>
					<div className="ghost_button" onClick={ () => { ghost_register(4); } }><i className="fas fa-ghost"></i>CASPER</div> */}
				
				</div>
			</div>
		);
	}
	else {
		return <Redirect to={{ pathname: '/' }} />;
	}
}

export default Login;
