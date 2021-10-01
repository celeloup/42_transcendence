import * as api from '../API';
import React from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import { useHistory } from "react-router-dom";

function Parameters() {
	const { logout } = React.useContext(AuthContext) as ContextType;
	const history = useHistory();
	
	async function paramLogout() {
		logout();
		await api.logout();
		history.push("/");
	}

	return (
			<div className="Parameters">
				<p>
					this is the Parameters page
				</p>
				<button onClick={paramLogout}>LOGOUT</button>
				<p><br/>[HERE CHANGE USERNAME, PROFILE PIC, ENABLE DOUBLE AUTH AND LOGOUT]</p>
			</div>
	);
  }
  
  export default Parameters;