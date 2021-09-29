import React from 'react';
import { AuthContext, ContextType} from '../AuthContext';

function Profile() {
	const { user } = React.useContext(AuthContext) as ContextType;
	return (
	  <div className="Profile">
		  <p>
			this is the Profile page
		  </p>
		  {user && 
		  <p>{ user.name }</p>
			}
	  </div>
	);
  }
  
  export default Profile;