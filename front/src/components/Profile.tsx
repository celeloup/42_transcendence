import React from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';

function Profile() {
	const { user } = React.useContext(AuthContext) as ContextType;
	return (
	  <div className="Profile">
		  <p>
			this is the Profile page
		  </p>
		  { user && <p>{ user.name }</p> }
		  <p><br/>[HERE SEE USERNAME, PROFILE PIC, LIST OF FRIENDS, MATCH HISTORY]</p>
	  </div>
	);
  }
  
  export default Profile;