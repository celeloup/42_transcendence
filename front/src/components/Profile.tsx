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
					{/* <UserCard user_name="Calamity_a_choisit_un_login_tres_tres_tres_long_juste_pour_faire_chier"/> */}
					<Friends list_friends={my_friends}/>
				</div>
				<div id="column_right">
					<MatchHistory />
					<Achievements />
				</div>
			</div>
	);
  }
  
  export default Profile;