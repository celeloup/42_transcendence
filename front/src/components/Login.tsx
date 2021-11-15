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
	const ghost_authenticate = (id42:number) => {
		let mounted = true;

		if (mounted)
			setGhostLogin(id42);

		return () => { mounted = false };
	};

	useEffect(() => {
		let mounted = true;
	
		if (ghostLogin !== 0)
		{
			axios.post(`/authentication/log-in`, { "id42": ghostLogin })
			.then (response => {
				// console.log(response);
				if (mounted) {
					login(response.data);
					setRedir(true);
					setGhostLogin(0);
				}
			})
			.catch(error => {
				if (error.response.status === 403)
					console.log("ERROR:", error.response.data.message);
				else
					console.log("ERROR:", error);
				if (mounted)
					setGhostLogin(0);
			})
		}

		return () => { mounted = false };
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
					<div className="ghost_button" onClick={ () => { ghost_authenticate(1); } }><i className="fas fa-ghost"></i>GHOSTY</div>
					<div className="ghost_button" onClick={ () => { ghost_authenticate(2); } }><i className="fas fa-ghost"></i>ADMINISTRAGHOST</div>
					<div className="ghost_button" onClick={ () => { ghost_authenticate(4); } }><i className="fas fa-ghost"></i>MODOGHOST</div>
					<div className="ghost_button" onClick={ () => { ghost_authenticate(3); } }><i className="fas fa-ghost"></i>CASPER</div>
				
				</div>
			</div>
		);
	}
	else {
		return <Redirect to={{ pathname: '/' }} />;
	}
}

export default Login;
