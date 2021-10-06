import React from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import Avatar from './profile/Avatar';

function Profile() {
	const { user } = React.useContext(AuthContext) as ContextType;
	return (
			<div className="profile">
				<p>
					this is the Profile page
				</p>
				<Avatar></Avatar>
				{ user && <p>id42 = { user.id42 }</p> }
				<p><br/>[HERE SEE USERNAME, PROFILE PIC, LIST OF FRIENDS, MATCH HISTORY, ACHIEVEMENT]</p>
			</div>
	);
  }
  
  export default Profile;