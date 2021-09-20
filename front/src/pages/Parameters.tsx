import * as api from './../API';
import React from 'react';
import { AuthContext, ContextType} from '../AuthContext';

function Parameters() {
	console.log("params");
	const { isAuth, logout } = React.useContext(AuthContext) as ContextType;

	const paramLogout = () => {
		// logout();
		api.logout();
	}

	const paramIsAuth = () => {
		console.log(isAuth);
		api.isAuth();
	}


	// api.isAuth();
	return (
	  <div className="Parameters">
		  <p>
			this is the Parameters page
		  </p>
		  <button onClick={paramLogout}>LOGOUT</button>

		  <button onClick={paramIsAuth}>ISAUTH</button>
	  </div>
	);
  }
  
  export default Parameters;