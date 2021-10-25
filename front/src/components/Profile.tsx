import React, { useEffect } from 'react';
import axios from "axios";
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

function Profile (props : any) {
	const [username, setUsername] = React.useState<string>("");
	const [hasAvatar, setHasAvatar] = React.useState<boolean>(false);
	const [matches, setMatches] = React.useState<Match[]>([]);
	const [nbMatches, setNbMatches] = React.useState<number>(0);
	const [nbVictories, setNbVictories] = React.useState<number>(0);
	const [nbPoints, setNbPoints] = React.useState<number>(0);
	const [rank, setRank] = React.useState<number>(0);
	const [friends, setFriends] = React.useState<Friend[]>([]);
	
	const userId = +props.match.params.id;

	useEffect(() => {
		axios.get("/users/infos/" + userId)
		.then(response => { setUsername(response.data.name);
							setHasAvatar(response.data.avatar !== null)
						})
		.catch(error => { console.log(error.response); });

		axios.get("/users/matches/" + userId)
		.then(response => { setMatches(response.data);
							setNbMatches(response.data.length);
							setNbVictories(response.data.filter(function(match : Match) {
								return (match.winner === userId);
							}).length);
							setNbPoints(response.data.map(function(match : Match) {
								if (match.user1_id === userId)
									return (match.score_user1);
								else
									return (match.score_user2);
							}).reduce((prev : number, current : number) => prev + current))
		})
		.catch(error => { console.log(error.response); })

		axios.get("/users/friends/" + userId)
		.then(response => { setFriends(response.data); })
		.catch(error => { console.log(error.response); });

		axios.get("/users/ranked")
		.then(response => { setRank(response.data.map((e : any) => e.id).indexOf(userId)); })
		.catch(error => { console.log(error.response); })
	}, [userId]);

	return (
			<div className="profile">
				<div id="column_left">
					<UserCard user_name={username} user_id={userId} has_avatar={hasAvatar} rank={rank}
						nb_matches={nbMatches} nb_victories={nbVictories} nb_points={nbPoints}/>
					<Friends friends={friends}/>
				</div>
				<div id="column_right">
					<MatchHistory matches={matches} my_id={userId}/>
					<Achievements />
				</div>
			</div>
	);
  }
  
  export default Profile;