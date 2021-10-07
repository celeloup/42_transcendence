import React from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import UserCard from './profile/UserCard';
import Friends from './profile/Friends';
import MatchHistory from './profile/MatchHistory';
import Achievements from './profile/Achievements';
import '../styles/Profile.scss';

const my_friends = ['Le loup', 'Le canard', 'Antho'];

function Profile() {
	const { user } = React.useContext(AuthContext) as ContextType;
	return (
			<div className="profile">
				<div id="column_left">
					<UserCard user_name="Calamity"/>
					<Friends list_friends={my_friends}/>
				</div>
				<div id="column_right">
					<MatchHistory />
					<Achievements />
				</div>
				{/* <Avatar alt_img='cowgirl' alert_prof={() => alert('Hello jgonfroy')} /> */}
				{/* { user && <p>id42 = { user.id42 }</p> } */}
				{/* <p><br/>[HERE SEE USERNAME, PROFILE PIC, LIST OF FRIENDS, MATCH HISTORY, ACHIEVEMENT]</p> */}
			</div>
	);
  }
  
  export default Profile;