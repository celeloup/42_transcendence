import React from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import Avatar from './profile/Avatar';
import Friends from './profile/Friends';

const my_friends = ['celeloup', 'amartin-', 'fhenrion'];

function Profile() {
	const { user } = React.useContext(AuthContext) as ContextType;
	return (
			<div className="profile">
				<p>
					this is the Profile page
				</p>
				<Avatar alt_img='cowgirl' alert_prof={() => alert('Hello jgonfroy')} />
				<Friends login='jgonfroy' list_friends={my_friends}/>
				{ user && <p>id42 = { user.id42 }</p> }
				<p><br/>[HERE SEE USERNAME, PROFILE PIC, LIST OF FRIENDS, MATCH HISTORY, ACHIEVEMENT]</p>
			</div>
	);
  }
  
  export default Profile;