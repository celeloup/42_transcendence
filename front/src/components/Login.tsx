import axios from 'axios';
import { AuthContext, ContextType }  from '../contexts/AuthContext';
import { useContext } from 'react';
import '../styles/Login.scss';
import Logo from './ui_components/Logo';
import Logo42 from './ui_components/42Logo';
import { useHistory } from "react-router-dom";

function Login() {
	const { login } = useContext(AuthContext) as ContextType;
	const history = useHistory();
	
	const ghost_authenticate = (id42:number) => {
		axios.post(`/authentication/log-in`, { "id42": id42 })
		.then (response => {
			// console.log(response);
			login(response.data);
			history.push("/");
		})
		.catch(error => {
			if (error.response.status === 403)
				console.log("ERROR:", error.response.data.message);
			else
				console.log("ERROR:", error);
		})
	};

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

export default Login;
