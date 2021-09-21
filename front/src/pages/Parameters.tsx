import * as api from './../API';
import React from 'react';
import { AuthContext, ContextType} from '../AuthContext';
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
	  </div>
	);
  }
  
  export default Parameters;