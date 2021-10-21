import React, { useEffect } from 'react';
import axios from 'axios';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import UserCard from './profile/UserCard';
import Friends from './profile/Friends';
import MatchHistory from './profile/MatchHistory';
import Achievements from './profile/Achievements';
import '../styles/Profile.scss';

type Match = {
	boost_available: boolean;
	createdDate: string;
	friendly: boolean;
	goal: number;
	id: number;
	map: number;
	score_user1: number;
	score_user2: number;
	speed: number;
	user1_id: number;
	user2_id: number;
	winner: number;
}

type Friend = {
	id: number;
	name: string;
	site_owner: boolean;
	site_moderator: boolean;
	site_banned: boolean;
}

function Profile() {
	const { user } = React.useContext(AuthContext) as ContextType;
	const [username, setUsername] = React.useState<string>("");
	const [userId, setUserId] = React.useState<number>(-1);
	const [hasAvatar, setHasAvatar] = React.useState<boolean>(false);
	const [matches, setMatches] = React.useState<Match[]>([]);
	const [nbMatches, setNbMatches] = React.useState<number>(0);
	const [nbVictories, setNbVictories] = React.useState<number>(0);
	const [nbPoints, setNbPoints] = React.useState<number>(0);
	const [friends, setFriends] = React.useState<Friend[]>([]);

	useEffect(() => {
		axios.get("/users/infos/me")
		.then(response => { setUsername(response.data.name);
							setUserId(response.data.id);
							setHasAvatar(response.data.avatar !== null)
						})
		.catch(error => { console.log(error.response); });

		axios.get("/users/matches/" + user!.id)
		.then(response => { setMatches(response.data);
							setNbMatches(response.data.length);
							setNbVictories(response.data.filter(function(match : Match) {
								return (match.winner === user!.id);
							}).length);
							setNbPoints(response.data.map(function(match : Match) {
								if (match.user1_id === user!.id)
									return (match.score_user1);
								else
									return (match.score_user2);
							}).reduce((prev : number, current : number) => prev + current))
		})
		.catch(error => { console.log(error.response); })

		axios.get("/users/friends/" + user!.id)
		.then(response => { console.log(response.data); setFriends(response.data); })
		.catch(error => { console.log(error.response); });
	}, []);

	return (
			<div className="profile">
				<div id="column_left">
					<UserCard user_name={username} user_id={userId} has_avatar={hasAvatar}
						nb_matches={nbMatches} nb_victories={nbVictories} nb_points={nbPoints}/>
					<Friends friends={friends}/>
				</div>
				<div id="column_right">
					<MatchHistory matches={matches}/>
					<Achievements />
				</div>
			</div>
	);
  }
  
  export default Profile;